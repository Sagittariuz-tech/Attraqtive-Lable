import { test } from "node:test";
import assert from "node:assert/strict";
import { changeQuantity, emptyFilters, filterProducts, money, normalizeLines, resolveBag } from "../src/lib/commerce";
import { checkoutSchema, consultationSchema } from "../src/lib/validation";

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
  assert.deepEqual(filterProducts({ ...emptyFilters, price: "under" }).map(item => item.sku), ["AL-OLV"]);
  assert.deepEqual(filterProducts({ ...emptyFilters, sort: "low" }).map(item => item.sku), ["AL-OLV", "AL-GAR", "AL-IVR"]);
  assert.deepEqual(filterProducts({ ...emptyFilters, availability: "consultation" }).map(item => item.sku), ["AL-IVR"]);
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
