import { z } from "zod";

const required = z.string().trim().min(2, "Enter at least 2 characters.").max(120);
export const checkoutSchema = z.object({
  name: required,
  email: z.string().trim().email("Enter a valid email address.").max(254),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pin: z.string().optional(),
  delivery: z.enum(["standard", "boutique"]),
}).superRefine((form, context) => {
  if (form.delivery !== "standard") return;
  for (const field of ["address", "city", "state"] as const) {
    const result = required.safeParse(form[field] ?? "");
    if (!result.success) context.addIssue({ code: "custom", path: [field], message: "Enter at least 2 characters." });
  }
  if (!/^[1-9][0-9]{5}$/.test(form.pin?.trim() ?? "")) {
    context.addIssue({ code: "custom", path: ["pin"], message: "Enter a valid six-digit Indian PIN code." });
  }
});

export const consultationSchema = z.object({
  name: required,
  contact: z.string().trim().max(254).refine(value => z.email().safeParse(value).success || /^\+?[0-9][0-9 ()-]{7,16}$/.test(value), "Enter a valid email address or phone number."),
  service: z.enum(["Bespoke design", "Bridal consultation", "Styling appointment", "Boutique visit"]),
  method: z.enum(["At the boutique", "Phone call"]),
  category: z.string().max(80),
  date: z.union([z.literal(""), z.iso.date()], { error: "Choose a valid date." }),
  notes: z.string().trim().max(600, "Keep your notes under 600 characters."),
});
