import { test } from "node:test";
import assert from "node:assert/strict";
import { changeQuantity, emptyFilters, filterProducts, money, normalizeLines, resolveBag } from "../src/lib/commerce";
import { checkoutSchema, consultationSchema } from "../src/lib/validation";
import { ownerReport, reportCsv, seedOwnerReport } from "../src/lib/owner-report";

test("bag clamps duplicate quantities to stock and ignores stale and unbuyable data", () => {
  assert.deepEqual(normalizeLines([{ id: "AL-GAR-S", quantity: 2 }, { id: "AL-GAR-S", quantity: 3 },
    { id: "AL-GAR-XS", quantity: 1 }, { id: "unknown", quantity: 1 }, null, { id: "AL-GAR-M", quantity: 0.3 }]), [{ id: "AL-GAR-S", quantity: 3 }]);
  const updated = changeQuantity([{ id: "AL-GAR-S", quantity: 1 }], "AL-GAR-S", 2);
  assert.equal(resolveBag(updated)[0].total, 5700000);
  assert.equal(money(resolveBag(updated)[0].total), "₹57,000");
  assert.deepEqual(changeQuantity(updated, "AL-GAR-S", 0), []);
});

test("catalogue matches indexed attributes and available sizes", () => {
  assert.deepEqual(filterProducts({ ...emptyFilters, query: "bridal velvet" }).map(item => item.sku), ["AL-GAR"]);
  assert.deepEqual(filterProducts({ ...emptyFilters, size: "XS" }), []);
  assert.deepEqual(filterProducts({ ...emptyFilters, price: "under" }).map(item => item.sku), ["AL-OLV", "AL-CHP", "AL-SEA"]);
  assert.deepEqual(filterProducts({ ...emptyFilters, sort: "low" }).map(item => item.sku), ["AL-OLV", "AL-SEA", "AL-CHP", "AL-MID", "AL-BAN", "AL-GAR", "AL-SHE", "AL-IVR", "AL-ROS"]);
  assert.deepEqual(filterProducts({ ...emptyFilters, availability: "consultation" }).map(item => item.sku), ["AL-IVR", "AL-ROS"]);
});

test("owner metrics reconcile period sales, returns, category filters and a browser receipt", () => {
  const now = Date.parse("2026-11-16T09:00:00.000Z");
  const sample = seedOwnerReport(now);
  const base = ownerReport(sample, [], now, 30, "");
  const report = ownerReport(sample, [{ id: "DEMO-TEST", createdAt: new Date(now).toISOString(), delivery: "boutique",
    items: [{ sku: "AL-GAR", title: "Garnet Zardozi Lehenga", size: "M", colour: "Garnet", quantity: 2, unitPrice: 2850000 }] }], now, 30, "");
  assert.equal(report.netSales - base.netSales, 5700000);
  assert.equal(report.units - base.units, 2);
  assert.equal(report.paidOrders - base.paidOrders, 1);
  assert.equal(report.grossMargin, base.grossMargin);
  assert.equal(report.trend.reduce((sum, interval) => sum + interval.value, 0), report.netSales);
  assert.equal(report.demand.reduce((sum, item) => sum + item.sales, 0), report.netSales);
  assert.ok(report.refundValue > 0);
  const menswear = ownerReport(sample, [], now, 7, "menswear");
  assert.ok(menswear.demand.length > 0 && menswear.demand.every(item => item.product.category === "menswear"));
  assert.match(reportCsv(report.orders.filter(order => order.source === "This browser")), /"DEMO-TEST".*"57000.00"/);
});

test("validates sample checkout and consultation data", () => {
  const checkout = { name: "Demo Guest", email: "guest@example.test", address: "1 Sample Street", city: "Visakhapatnam", state: "Andhra Pradesh", pin: "530002", delivery: "standard" };
  assert.equal(checkoutSchema.safeParse(checkout).success, true);
  assert.equal(checkoutSchema.safeParse({ ...checkout, pin: "030002" }).success, false);
  assert.equal(checkoutSchema.safeParse({ name: checkout.name, email: checkout.email, delivery: "boutique" }).success, true);
  const consultation = { name: "Demo Guest", contact: "+91 90000 00000", service: "Bespoke design", method: "At the boutique", category: "", date: "", notes: "" };
  assert.equal(consultationSchema.safeParse(consultation).success, true);
  assert.equal(consultationSchema.safeParse({ ...consultation, contact: "invalid" }).success, false);
});
