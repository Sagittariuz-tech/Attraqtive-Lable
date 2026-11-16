"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { consultationSchema } from "./validation";
import { useDemoAuth } from "./demo-auth";
import { updateDemoStorage } from "./demo-storage";

export const enquiryStages = ["New", "Contacted", "Consultation booked", "Quoted", "Confirmed", "Closed"] as const;
const date = z.union([z.literal(""), z.iso.date()]);
const enquirySchema = z.object({
  id: z.string(), createdAt: z.iso.datetime(), origin: z.enum(["Sample", "This browser"]),
  service: consultationSchema.shape.service, method: consultationSchema.shape.method,
  category: z.string(), garment: z.string(), eventDate: date,
  stage: z.enum(enquiryStages), followUp: date,
});

export type DemoEnquiry = z.infer<typeof enquirySchema>;
type Intake = Pick<DemoEnquiry, "service" | "method" | "category" | "garment" | "eventDate">;
type EnquiryStore = {
  enquiries: DemoEnquiry[];
  submit: (input: Intake) => Promise<DemoEnquiry>;
  update: (id: string, stage: DemoEnquiry["stage"], followUp: string) => Promise<boolean>;
};

function sampleEnquiries(): DemoEnquiry[] {
  const createdAt = "2026-11-16T09:00:00.000Z";
  return [
    { id: "ENQ-S001", createdAt, origin: "Sample", service: "Bridal consultation", method: "At the boutique",
      category: "bridal", garment: "rosewood-bridal-lehenga", eventDate: "", stage: "New", followUp: "" },
    { id: "ENQ-S002", createdAt, origin: "Sample", service: "Bespoke design", method: "Phone call",
      category: "menswear", garment: "ivory-embroidered-sherwani", eventDate: "", stage: "Consultation booked", followUp: "" },
  ];
}

export const enquiryStorageKey = "attraqtive-demo-enquiries";
export const useDemoEnquiries = create<EnquiryStore>()(persist<EnquiryStore, [], [], Pick<EnquiryStore, "enquiries">>((set, get) => ({
  enquiries: sampleEnquiries(),
  submit: ({ service, method, category, garment, eventDate }): Promise<DemoEnquiry> => updateDemoStorage(enquiryStorageKey, () => useDemoEnquiries.persist.rehydrate(), () => {
    const enquiry: DemoEnquiry = {
      id: "ENQ-" + crypto.randomUUID().slice(0, 8).toUpperCase(), createdAt: new Date().toISOString(),
      origin: "This browser", service, method, category, garment, eventDate, stage: "New", followUp: "",
    };
    set(state => ({ enquiries: [enquiry, ...state.enquiries] }));
    return enquiry;
  }),
  update: (id, stage, followUp): Promise<boolean> => updateDemoStorage(enquiryStorageKey, () => useDemoEnquiries.persist.rehydrate(), () => {
    if (useDemoAuth.getState().role !== "admin" || !date.safeParse(followUp).success || !enquiryStages.includes(stage)) return false;
    if (!get().enquiries.some(item => item.id === id)) return false;
    set(state => ({ enquiries: state.enquiries.map(enquiry => enquiry.id === id ? { ...enquiry, stage, followUp } : enquiry) }));
    return true;
  }),
}), {
  name: enquiryStorageKey,
  skipHydration: true,
  partialize: ({ enquiries }) => ({ enquiries }),
  merge: (stored, current) => {
    const saved = (stored as Partial<EnquiryStore> | null)?.enquiries;
    if (!Array.isArray(saved)) return current;
    const enquiries = saved.flatMap(enquiry => {
      const result = enquirySchema.safeParse(enquiry);
      return result.success ? [result.data] : [];
    });
    return { ...current, enquiries };
  },
}));
