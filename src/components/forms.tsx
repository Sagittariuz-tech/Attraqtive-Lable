"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { brand } from "@/data/brand";
import { categories, products } from "@/data/catalogue";
import { checkoutSchema, consultationSchema } from "@/lib/validation";
import { money, resolveBag } from "@/lib/commerce";
import { useShop } from "@/lib/store";
import { useDemoAuth } from "@/lib/demo-auth";
import { useDemoOrders, type DemoReceipt } from "@/lib/demo-orders";
import { useDemoEnquiries, type DemoEnquiry } from "@/lib/demo-enquiries";
import { EmptyBag } from "./shopping";
import { Overlay } from "./shell";
import { DemoSignIn } from "./demo-sign-in";

function Field({ title, error, children }: { title: string; error?: string; children: ReactNode }) {
  return <div className="field"><label>{title}{children}</label>{error && <p role="alert" className="error">{error}</p>}</div>;
}

export function Checkout() {
  const lines = useShop(state => state.lines);
  const role = useDemoAuth(state => state.role);
  const ready = useDemoAuth(state => state.ready);
  const [signInOpen, setSignInOpen] = useState(false);
  const items = resolveBag(lines);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  const [receipt, setReceipt] = useState<DemoReceipt>();
  const [bagError, setBagError] = useState("");
  const submitting = useRef(false);
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<z.input<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema), defaultValues: { delivery: "standard" }, shouldUnregister: true,
  });
  const delivery = useWatch({ control, name: "delivery" });
  if (receipt) return <div className="empty-state" role="status"><Check size={28} /><h2>Demo order complete</h2><p>Receipt {receipt.id}. {receipt.customer ? "You can find it in your demo account." : "Your guest order is available in this browser’s owner register."}</p>
    <div className="button-row checkout-links">{receipt.customer && <Link className="button button-outline" href="/account/">View demo receipt</Link>}<Link className="button button-dark" href="/collections/">Continue exploring <ArrowRight size={16} /></Link></div></div>;
  if (!items.length) return <>{bagError && <p className="notice" role="alert">{bagError}</p>}<EmptyBag /><div className="center"><Link className="button button-dark" href="/collections/">Explore collections</Link></div></>;

  return <div className="form-layout">
    <form noValidate onSubmit={event => void handleSubmit(async ({ delivery }) => {
      const currentLines = useShop.getState().lines;
      if (!currentLines.length || submitting.current) return;
      submitting.current = true;
      setBagError("");
      try {
        const order = await useDemoOrders.getState().record(currentLines, delivery, useDemoAuth.getState().role === "customer");
        if (!order) {
          useShop.getState().reconcileStock();
          setBagError("Sample availability changed. Your bag has been updated. Review it before continuing.");
          return;
        }
        useShop.getState().removePurchased(currentLines);
        setReceipt(order);
      } catch {
        setBagError("The sample order couldn’t be recorded. Try again.");
      } finally {
        submitting.current = false;
      }
    })(event)}>
      <h2>{role === "customer" ? "Customer details" : "Guest checkout"}</h2>
      {ready && role !== "customer" && <Overlay open={signInOpen} onOpenChange={setSignInOpen}
        trigger={<button type="button" className="plain-link checkout-sign-in">Sign in to save this receipt to your account</button>}
        title="Customer sign-in" description="Optional sign-in for demo order history">
        <div className="overlay-body"><DemoSignIn allowed="customer" onSignedIn={() => setSignInOpen(false)} /></div>
      </Overlay>}
      <div className="form-grid">
        <Field title="Full name" error={errors.name?.message}><input {...register("name")} autoComplete="off" aria-invalid={!!errors.name} /></Field>
        <Field title="Email" error={errors.email?.message}><input type="email" {...register("email")} autoComplete="off" aria-invalid={!!errors.email} /></Field>
      </div>
      <h2>Delivery selection</h2>
      <div className="form-grid">
        <Field title="Delivery method" error={errors.delivery?.message}><select {...register("delivery")}><option value="standard">Standard demo delivery</option><option value="boutique">Boutique collection</option></select></Field>
        {delivery !== "boutique" && <>
        <Field title="Street address" error={errors.address?.message}><input {...register("address")} autoComplete="off" aria-invalid={!!errors.address} /></Field>
        <Field title="City" error={errors.city?.message}><input {...register("city")} autoComplete="off" aria-invalid={!!errors.city} /></Field>
        <Field title="State" error={errors.state?.message}><input {...register("state")} autoComplete="off" aria-invalid={!!errors.state} /></Field>
        <Field title="PIN code" error={errors.pin?.message}><input {...register("pin")} inputMode="numeric" maxLength={6} autoComplete="off" aria-invalid={!!errors.pin} /></Field>
        </>}
      </div>
      <h2>Payment</h2><p className="notice">Simulated payment. This preview does not ask for card or UPI details.</p>
      {bagError && <p className="notice" role="alert">{bagError}</p>}
      <button className="button button-dark" type="submit" disabled={!ready || isSubmitting}>Complete demo order <ArrowRight size={16} /></button>
    </form>
    <aside className="summary-panel">
      <h2>Order summary</h2>
      <ul>{items.map(item => <li key={item.id}><span>{item.product.title} × {item.quantity}<small>{item.variant.colour} · {item.variant.size}</small></span><strong>{money(item.total)}</strong></li>)}</ul>
      <p className="subtotal"><span>Sample subtotal</span><strong>{money(total)}</strong></p>
      <p className="fine">{delivery === "boutique" ? "Sample boutique collection." : "Shipping and taxes await approval."}</p>
    </aside>
  </div>;
}

export function ConsultationForm() {
  const params = useSearchParams();
  const garment = products.find(product => product.title === params.get("garment"));
  const [request, setRequest] = useState<DemoEnquiry | null>(null);
  const [failure, setFailure] = useState("");
  const submit = useDemoEnquiries(state => state.submit);
  const ready = useDemoAuth(state => state.ready);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.input<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema), defaultValues: { service: "Bespoke design", method: "At the boutique", notes: "", date: "", category: garment?.category ?? "" },
  });
  return <>
    <p className="notice">Use sample contact details. This browser’s demo owner queue receives the request type and occasion details. Names, contact details and notes stay in this form.</p>
    {request ? <div className="empty-state" role="status"><Check size={27} /><h3>Demo enquiry received</h3><p>{request.id} · {request.service} · {request.method}</p><p>Saved to this browser’s owner queue for a sample follow-up.</p><button className="button button-outline" onClick={() => { reset(); setRequest(null); }}>Start another preview</button></div> :
      <form noValidate onSubmit={handleSubmit(async ({ service, method, category, date }) => {
        try {
          setRequest(await submit({ service, method, category, garment: garment?.slug ?? "", eventDate: date }));
          reset();
        } catch {
          setFailure("The sample enquiry couldn’t be saved. Try again.");
        }
      })}>
        {garment && <p>Inspiration: {garment.title}</p>}
        <div className="form-grid">
          <Field title="Name" error={errors.name?.message}><input {...register("name")} autoComplete="off" aria-invalid={!!errors.name} /></Field>
          <Field title="Email or phone" error={errors.contact?.message}><input {...register("contact")} autoComplete="off" aria-invalid={!!errors.contact} /></Field>
          <Field title="Consultation type"><select {...register("service")}>{["Bespoke design", "Bridal consultation", "Styling appointment", "Boutique visit"].map(value => <option key={value}>{value}</option>)}</select></Field>
          <Field title="Preferred method"><select {...register("method")}><option>At the boutique</option><option>Phone call</option></select></Field>
          <Field title="Garment category (optional)"><select {...register("category")}><option value="">Choose a category</option>{categories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></Field>
          <Field title="Occasion date (optional)" error={errors.date?.message}><input type="date" {...register("date")} /></Field>
        </div>
        <Field title="Occasion or design notes (optional)" error={errors.notes?.message}><textarea rows={4} maxLength={600} {...register("notes")} /></Field>
        {failure && <p className="error" role="alert">{failure}</p>}
        <button type="submit" className="button button-dark" disabled={!ready || isSubmitting}>Submit demo enquiry <ArrowRight size={16} /></button>
      </form>}
  </>;
}

export function WhatsAppPreview() {
  const params = useSearchParams();
  const garment = products.find(product => product.title === params.get("garment"))?.title;
  const [context, setContext] = useState(garment ? "Product enquiry" : "Bespoke consultation");
  const [copied, setCopied] = useState("");
  const message = "Hello Attraqtive Label, I’d like to ask about " + (context === "Product enquiry" && garment ? "the " + garment : context.toLowerCase()) + ". Could you share the next steps?";
  return <Overlay trigger={<button className="button button-outline"><MessageCircle size={18} /> Preview WhatsApp enquiry</button>}
    title="WhatsApp enquiry preview" description="Choose an enquiry type and preview the suggested message">
    <div className="overlay-body">
      <Field title="Enquiry type"><select value={context} onChange={event => { setContext(event.target.value); setCopied(""); }}>
        <option>Bespoke consultation</option><option>Bridal consultation</option><option>Product enquiry</option><option>Order assistance</option>
      </select></Field>
      <blockquote className="notice">{message}</blockquote>
      {brand.whatsapp ? <a className="button button-dark" href={"https://wa.me/" + brand.whatsapp + "?text=" + encodeURIComponent(message)}>Open WhatsApp</a> :
        <><p className="fine">The boutique’s WhatsApp number is awaiting confirmation.</p><button className="button button-dark" onClick={async () => {
          try { await navigator.clipboard.writeText(message); setCopied("Message copied."); } catch { setCopied("Select the message to copy it manually."); }
        }}>Copy sample message</button></>}
      <p role="status" className="fine">{copied}</p>
    </div>
  </Overlay>;
}
