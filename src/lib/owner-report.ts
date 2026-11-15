import { categoryName, products, type Product } from "../data/catalogue";
import { unitPrice } from "./commerce";
import type { DemoReceipt } from "./demo-orders";

const dayMs = 86_400_000;
export const reportPeriods = [7, 30, 90] as const;
export const orderStatuses = ["Processing", "Ready for pickup", "Shipped", "Delivered", "Refunded", "Cancelled"] as const;
type OrderStatus = (typeof orderStatuses)[number];

type ReportOrder = {
  id: string;
  at: number;
  source: "Seeded" | "This browser";
  customer: string;
  city: string;
  channel: "Online" | "Boutique";
  status: OrderStatus;
  items: { sku: string; size: string; units: number; price: number; cost: number }[];
};

type Activity = { sku: string; at: number; views: number; bagAdds: number; saves: number; enquiries: number };
type ReportData = { orders: ReportOrder[]; activity: Activity[] };
const retail = products.filter(product => product.commerce.kind === "retail");
const bySku = new Map(products.map(product => [product.sku, product]));
const channels = ["Online", "Boutique"] as const;
export const netTotal = (order: ReportOrder) => order.status === "Refunded" || order.status === "Cancelled"
  ? 0 : order.items.reduce((total, line) => total + line.units * line.price, 0);

export function seedOwnerReport(now: number): ReportData {
  const cities = ["Visakhapatnam", "Hyderabad", "Vijayawada", "Rajahmundry", "Bengaluru"];
  const statuses: OrderStatus[] = ["Delivered", "Delivered", "Delivered", "Refunded", "Delivered", "Cancelled", "Delivered", "Delivered"];
  const weights = [0, 0, 1, 0, 2, 3, 1, 4, 5, 6];
  const orders = Array.from({ length: 180 }, (_, day) => {
    const product = retail[weights[(day * 7 + Math.floor(day / 4)) % weights.length] % retail.length];
    if (product.commerce.kind !== "retail") throw new Error("No retail variant for report fixture");
    const variant = product.commerce.variants[(day * 3) % product.commerce.variants.length];
    const price = unitPrice(variant);
    const status = day < 4 ? (["Processing", "Ready for pickup", "Shipped", "Delivered"] as const)[day] : statuses[(day * 3 + Math.floor(day / 5)) % statuses.length];
    return {
      id: "AL-S" + (4000 - day), at: now - day * dayMs - 60000, source: "Seeded" as const,
      customer: "Sample client " + ((day * 17) % 41 + 1), city: cities[(day * 3 + Math.floor(day / 6)) % cities.length],
      channel: channels[status === "Ready for pickup" ? 1 : Number(day % 4 === 2)], status,
      items: [{ sku: product.sku, size: variant.size, units: day % 13 === 0 ? 2 : 1, price, cost: Math.round(price * (.38 + (day % 5) * .03)) }],
    };
  });
  const activity = Array.from({ length: 180 }, (_, day) => products.map((product, index) => {
    const views = Math.max(7, 63 - index * 5) + (day * 13 + index * 7) % 27;
    return {
      sku: product.sku, at: now - day * dayMs - 60_000, views,
      bagAdds: product.commerce.kind === "retail" ? Math.floor(views / (5 + index % 4)) : 0,
      saves: Math.floor(views / (8 + (day + index) % 7)),
      enquiries: product.commerce.kind === "consultation" ? 1 + (day + index) % 4 : Number((day + index) % 11 === 0),
    };
  })).flat();
  return { orders, activity };
}

type Demand = {
  product: Product; views: number; saves: number; bagAdds: number; enquiries: number;
  units: number; sales: number; refundedUnits: number; stock: number | null;
};

function browserOrders(receipts: DemoReceipt[]): ReportOrder[] {
  return receipts.map(receipt => ({
    id: receipt.id, at: Date.parse(receipt.createdAt), source: "This browser", customer: "Demo customer", city: "Not recorded",
    channel: receipt.delivery === "boutique" ? "Boutique" : "Online", status: "Processing",
    items: receipt.items.map(item => ({ sku: item.sku, size: item.size, units: item.quantity, price: item.unitPrice, cost: 0 })),
  }));
}

export function ownerReport(data: ReportData, receipts: DemoReceipt[], now: number, days: number, category: string) {
  const includes = (sku: string) => !category || bySku.get(sku)?.category === category;
  const start = now - days * dayMs;
  const eligible = [...data.orders, ...browserOrders(receipts)].map(order => ({ ...order, items: order.items.filter(item => includes(item.sku)) }))
    .filter(order => order.items.length);
  const orders = eligible.filter(order => order.at > start && order.at <= now).sort((a, b) => b.at - a.at);
  const paid = orders.filter(order => netTotal(order) > 0);
  const previousSales = eligible.filter(order => order.at > start - days * dayMs && order.at <= start).reduce((sum, order) => sum + netTotal(order), 0);
  const netSales = orders.reduce((sum, order) => sum + netTotal(order), 0);
  const refunded = orders.filter(order => order.status === "Refunded");
  const refundValue = refunded.reduce((sum, order) => sum + order.items.reduce((subtotal, item) => subtotal + item.units * item.price, 0), 0);
  const paidSeeded = paid.filter(order => order.source === "Seeded");
  const seededSales = paidSeeded.reduce((sum, order) => sum + netTotal(order), 0);
  const seededCost = paidSeeded.flatMap(order => order.items).reduce((sum, line) => sum + line.units * line.cost, 0);
  const distinctCustomers = new Set(paidSeeded.map(order => order.customer));
  const repeatCustomers = new Set(paidSeeded.filter(order => data.orders.some(earlier =>
    earlier.customer === order.customer && earlier.at < order.at && netTotal(earlier) > 0)).map(order => order.customer));

  const demand: Demand[] = products.filter(product => includes(product.sku)).map(product => {
    const stats = data.activity.filter(item => item.sku === product.sku && item.at > start && item.at <= now);
    const sold = paid.flatMap(order => order.items).filter(item => item.sku === product.sku);
    const stock = product.commerce.kind === "retail" ? product.commerce.variants.reduce((sum, variant) => sum + variant.stock, 0) : null;
    return {
      product, views: stats.reduce((sum, item) => sum + item.views, 0), saves: stats.reduce((sum, item) => sum + item.saves, 0),
      bagAdds: stats.reduce((sum, item) => sum + item.bagAdds, 0), enquiries: stats.reduce((sum, item) => sum + item.enquiries, 0),
      units: sold.reduce((sum, item) => sum + item.units, 0), sales: sold.reduce((sum, item) => sum + item.units * item.price, 0),
      refundedUnits: refunded.flatMap(order => order.items).filter(item => item.sku === product.sku).reduce((sum, item) => sum + item.units, 0),
      stock,
    };
  });

  const intervals = days === 7 ? 7 : 6;
  const trend = Array.from({ length: intervals }, (_, index) => {
    const from = start + dayMs * days * index / intervals;
    const to = start + dayMs * days * (index + 1) / intervals;
    const value = orders.filter(order => order.at > from && order.at <= to).reduce((sum, order) => sum + netTotal(order), 0);
    return { from, to, value };
  });
  const breakdown = <T extends string>(values: readonly T[], matches: (order: ReportOrder, value: T) => boolean) => values.map(label => ({
    label,
    sales: paid.filter(order => matches(order, label)).reduce((sum, order) => sum + netTotal(order), 0),
    orders: paid.filter(order => matches(order, label)).length,
  })).sort((a, b) => b.sales - a.sales);

  return {
    orders, demand, trend, netSales, previousSales, refundValue, refundedOrders: refunded.length,
    paidOrders: paid.length, units: demand.reduce((sum, item) => sum + item.units, 0),
    avgOrder: paid.length ? Math.round(netSales / paid.length) : 0,
    grossMargin: seededSales ? (seededSales - seededCost) / seededSales : null,
    repeatRate: distinctCustomers.size ? repeatCustomers.size / distinctCustomers.size : null,
    channelSales: breakdown(channels, (order, channel) => order.channel === channel),
    citySales: breakdown([...new Set(paid.filter(order => order.source === "Seeded").map(order => order.city))], (order, city) => order.city === city),
    lowStock: demand.flatMap(({ product }) => product.commerce.kind === "retail" ? product.commerce.variants.filter(variant => variant.stock <= 1)
      .map(variant => ({ product, variant })) : []).sort((a, b) => a.variant.stock - b.variant.stock),
  };
}

export function reportCsv(orders: ReportOrder[]) {
  const rows = orders.flatMap(order => order.items.map(item => [
    order.id, new Date(order.at).toISOString(), order.source, order.channel, order.status, order.city,
    item.sku, categoryName(bySku.get(item.sku)?.category ?? ""), item.size, item.units,
    (item.price / 100).toFixed(2), (netTotal(order) > 0 ? item.price * item.units / 100 : 0).toFixed(2),
  ]));
  const headers = ["Order ID", "Date UTC", "Source", "Channel", "Status", "City", "SKU", "Category", "Size", "Units", "Unit price INR", "Net sales INR"];
  return [headers, ...rows].map(row => row.map(cell => {
    const value = String(cell);
    return '"' + (/^[=+\-@\t\r]/.test(value) ? "'" : "") + value.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n");
}
