"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { resolveBag, unitPrice, type Line } from "./commerce";

const receiptSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  delivery: z.enum(["standard", "boutique"]),
  items: z.array(z.object({
    sku: z.string(), title: z.string(), size: z.string(), colour: z.string(),
    quantity: z.number().int().positive(), unitPrice: z.number().int().nonnegative(),
  })).min(1),
});

export type DemoReceipt = z.infer<typeof receiptSchema>;

type ReceiptStore = {
  receipts: DemoReceipt[];
  record: (lines: Line[], delivery: DemoReceipt["delivery"]) => DemoReceipt | undefined;
};

export const receiptTotal = (receipt: DemoReceipt) => receipt.items.reduce((total, line) => total + line.quantity * line.unitPrice, 0);
export const receiptDate = (createdAt: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(createdAt));

export const useDemoOrders = create<ReceiptStore>()(persist(set => ({
  receipts: [],
  record: (lines, delivery) => {
    const items = resolveBag(lines).map(({ product, variant, quantity }) => ({
      sku: product.sku, title: product.title, size: variant.size, colour: variant.colour, quantity, unitPrice: unitPrice(variant),
    }));
    if (!items.length) return;
    const receipt = { id: "DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase(), createdAt: new Date().toISOString(), delivery, items };
    set(state => ({ receipts: [receipt, ...state.receipts].slice(0, 100) }));
    return receipt;
  },
}), {
  name: "attraqtive-demo-receipts",
  skipHydration: true,
  partialize: ({ receipts }) => ({ receipts }),
  merge: (stored, current) => {
    const receipts = (stored as Partial<ReceiptStore> | null)?.receipts;
    return { ...current, receipts: Array.isArray(receipts) ? receipts.slice(0, 100).flatMap(receipt => {
      const result = receiptSchema.safeParse(receipt);
      return result.success ? [result.data] : [];
    }) : [] };
  },
}));
