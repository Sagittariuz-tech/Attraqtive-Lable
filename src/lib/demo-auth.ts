"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DemoRole = "customer" | "admin";
export const demoAccounts = {
  customer: { name: "Demo Customer", email: "customer@example.test", code: "SHOP2026" },
  admin: { name: "Demo Boutique Owner", email: "owner@example.test", code: "OWNER2026" },
} satisfies Record<DemoRole, { name: string; email: string; code: string }>;

type DemoAuth = {
  role: DemoRole | null;
  ready: boolean;
  signIn: (role: DemoRole, email: string, code: string) => boolean;
  signOut: () => void;
};

export const useDemoAuth = create<DemoAuth>()(persist(set => ({
  role: null,
  ready: false,
  signIn: (role, email, code) => {
    const account = demoAccounts[role];
    if (email.trim().toLowerCase() !== account.email || code.trim() !== account.code) return false;
    set({ role });
    return true;
  },
  signOut: () => set({ role: null }),
}), {
  name: "attraqtive-demo-session",
  storage: createJSONStorage(() => sessionStorage),
  skipHydration: true,
  partialize: ({ role }) => ({ role }),
  merge: (stored, current) => {
    const role = (stored as Partial<DemoAuth> | null)?.role;
    return { ...current, role: role === "customer" || role === "admin" ? role : null };
  },
}));
