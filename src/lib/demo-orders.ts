"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { products } from "../data/catalogue";
import { availableUnits, resolveBag, unitPrice, type Line, type Stock } from "./commerce";
import { useDemoAuth } from "./demo-auth";
import { updateDemoStorage } from "./demo-storage";

export const fulfilmentStatuses = ["Processing", "Ready for pickup", "Shipped", "Delivered", "Collected", "Cancelled"] as const;
export const paymentStatuses = ["Paid", "Refunded", "Unpaid"] as const;
const receiptSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  delivery: z.enum(["standard", "boutique"]),
  customer: z.boolean().default(true),
  fulfilment: z.enum(fulfilmentStatuses).default("Processing"),
  payment: z.enum(paymentStatuses).default("Paid"),
  refundedAt: z.iso.datetime().optional(),
  restocked: z.boolean().default(false),
  items: z.array(z.object({
    variantId: z.string().optional(), sku: z.string(), title: z.string(), size: z.string(), colour: z.string(),
    quantity: z.number().int().positive(), unitPrice: z.number().int().nonnegative(),
  })).min(1),
});

export type DemoReceipt = z.infer<typeof receiptSchema>;
type OrderAction = "advance" | "refund" | "restock";
type ReceiptStore = {
  receipts: DemoReceipt[];
  stock: Stock;
  record: (lines: Line[], delivery: DemoReceipt["delivery"], customer: boolean) => Promise<DemoReceipt | undefined>;
  updateOrder: (id: string, action: OrderAction, expected: DemoReceipt["fulfilment"]) => Promise<void>;
};

export const receiptTotal = (receipt: DemoReceipt) => receipt.items.reduce((total, line) => total + line.quantity * line.unitPrice, 0);
export const receiptDate = (createdAt: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(createdAt));

const variantsByOptions = new Map(products.flatMap(product => product.commerce.kind === "retail"
  ? product.commerce.variants.map(variant => [JSON.stringify([product.sku, variant.size, variant.colour]), variant] as const)
  : []));

export function remainingDemoStock(receipts: DemoReceipt[]): Stock {
  const stock = new Map<string, number>();
  for (const receipt of receipts) {
    if (receipt.restocked) continue;
    for (const item of receipt.items) {
      const variant = variantsByOptions.get(JSON.stringify([item.sku, item.size, item.colour]));
      if (!variant || (item.variantId && item.variantId !== variant.id)) continue;
      stock.set(variant.id, Math.max(0, availableUnits(variant, stock) - item.quantity));
    }
  }
  return stock;
}

export function nextFulfilment(receipt: DemoReceipt) {
  if (receipt.payment !== "Paid") return;
  if (receipt.fulfilment === "Processing") return receipt.delivery === "boutique" ? "Ready for pickup" : "Shipped";
  if (receipt.fulfilment === "Ready for pickup") return "Collected";
  if (receipt.fulfilment === "Shipped") return "Delivered";
}

function changeOrder(receipt: DemoReceipt, action: OrderAction): DemoReceipt {
  if (action === "advance") {
    const fulfilment = nextFulfilment(receipt);
    return fulfilment ? { ...receipt, fulfilment } : receipt;
  }
  if (action === "refund" && receipt.payment === "Paid") {
    const cancellable = receipt.fulfilment === "Processing" || receipt.fulfilment === "Ready for pickup";
    return { ...receipt, payment: "Refunded", refundedAt: new Date().toISOString(), fulfilment: cancellable ? "Cancelled" : receipt.fulfilment };
  }
  if (action === "restock" && receipt.payment === "Refunded" && !receipt.restocked) return { ...receipt, restocked: true };
  return receipt;
}

export const receiptStorageKey = "attraqtive-demo-receipts";

export const useDemoOrders = create<ReceiptStore>()(persist<ReceiptStore, [], [], Pick<ReceiptStore, "receipts">>((set, get) => ({
  receipts: [],
  stock: new Map(),
  record: (lines, delivery, customer): Promise<DemoReceipt | undefined> => updateDemoStorage(receiptStorageKey, () => useDemoOrders.persist.rehydrate(), () => {
    const { receipts, stock } = get();
    const bag = resolveBag(lines, stock);
    if (!bag.length || bag.some(item => item.quantity !== lines.find(line => line.id === item.id)?.quantity) || bag.length !== lines.length) return;
    const items = bag.map(({ product, variant, quantity }) => ({
      variantId: variant.id, sku: product.sku, title: product.title, size: variant.size, colour: variant.colour, quantity, unitPrice: unitPrice(variant),
    }));
    const receipt: DemoReceipt = {
      id: "DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      createdAt: new Date().toISOString(), delivery, customer, items,
      fulfilment: "Processing", payment: "Paid", restocked: false,
    };
    const next = [receipt, ...receipts];
    set({ receipts: next, stock: remainingDemoStock(next) });
    return receipt;
  }),
  updateOrder: (id, action, expected): Promise<void> => updateDemoStorage(receiptStorageKey, () => useDemoOrders.persist.rehydrate(), () => {
    if (useDemoAuth.getState().role !== "admin") return;
    const receipts = get().receipts.map(receipt => receipt.id === id && (action !== "advance" || receipt.fulfilment === expected) ? changeOrder(receipt, action) : receipt);
    set({ receipts, stock: remainingDemoStock(receipts) });
  }),
}), {
  name: receiptStorageKey,
  skipHydration: true,
  partialize: ({ receipts }) => ({ receipts }),
  merge: (stored, current) => {
    const saved = (stored as Partial<ReceiptStore> | null)?.receipts;
    const receipts = Array.isArray(saved) ? saved.flatMap(receipt => {
      const result = receiptSchema.safeParse(receipt);
      return result.success ? [result.data] : [];
    }) : [];
    return { ...current, receipts, stock: remainingDemoStock(receipts) };
  },
}));
