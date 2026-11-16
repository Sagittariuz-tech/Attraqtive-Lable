"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { availableUnits, changeQuantity, normalizeLines, resolveBag, type Line } from "./commerce";
import { findProduct } from "../data/catalogue";
import { useDemoOrders } from "./demo-orders";

type Store = {
  lines: Line[]; saved: string[];
  add: (id: string) => void;
  moveSavedToBag: (slug: string, id: string) => boolean;
  setQuantity: (id: string, quantity: number) => void;
  toggleSave: (slug: string) => void;
  saveLine: (id: string) => void;
  removePurchased: (purchased: Line[]) => void;
  reconcileStock: () => void;
};

export const useShop = create<Store>()(persist((set) => ({
  lines: [], saved: [],
  add: id => set(state => ({ lines: changeQuantity(state.lines, id, (state.lines.find(line => line.id === id)?.quantity ?? 0) + 1, useDemoOrders.getState().stock) })),
  moveSavedToBag: (slug, id) => {
    let moved = false;
    set(state => {
      const product = findProduct(slug);
      if (!state.saved.includes(slug) || product?.commerce.kind !== "retail") return state;
      const variant = product.commerce.variants.find(option => option.id === id);
      const quantity = state.lines.find(line => line.id === id)?.quantity ?? 0;
      const stock = useDemoOrders.getState().stock;
      if (!variant || quantity >= availableUnits(variant, stock)) return state;
      moved = true;
      return {
        lines: changeQuantity(state.lines, id, quantity + 1, stock),
        saved: state.saved.filter(item => item !== slug),
      };
    });
    return moved;
  },
  setQuantity: (id, quantity) => set(state => ({ lines: changeQuantity(state.lines, id, quantity, useDemoOrders.getState().stock) })),
  toggleSave: slug => set(state => ({ saved: state.saved.includes(slug) ? state.saved.filter(item => item !== slug) : [...state.saved, slug] })),
  saveLine: id => set(state => {
    const item = resolveBag(state.lines).find(line => line.id === id);
    if (!item) return state;
    return { saved: [...new Set([...state.saved, item.product.slug])], lines: changeQuantity(state.lines, id, 0) };
  }),
  removePurchased: purchased => set(state => ({
    lines: normalizeLines(state.lines.map(line => ({
      ...line, quantity: line.quantity - (purchased.find(item => item.id === line.id)?.quantity ?? 0),
    })), useDemoOrders.getState().stock),
  })),
  reconcileStock: () => set(state => ({ lines: normalizeLines(state.lines, useDemoOrders.getState().stock) })),
}), {
  name: "attraqtive-storefront-v1",
  skipHydration: true,
  partialize: ({ lines, saved }) => ({ lines, saved }),
  merge: (persisted, current) => {
    const stored = persisted as Partial<Store> | undefined;
    return {
      ...current,
      lines: Array.isArray(stored?.lines) ? normalizeLines(stored.lines) : [],
      saved: Array.isArray(stored?.saved) ? [...new Set(stored.saved.filter(slug => typeof slug === "string" && findProduct(slug)))] : [],
    };
  },
}));
