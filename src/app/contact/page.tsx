import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { WhatsAppPreview } from "@/components/forms";
import { brand } from "@/data/brand";
export const metadata = { title: "Contact" };
export default function Contact() {
  return <section className="wrap inner-page narrow">
    <div className="page-heading"><p className="eyebrow">Client care</p><h1>Contact the boutique</h1><p>For styling, garment enquiries and boutique visits.</p></div>
    <div className="contact-list"><p><MapPin size={20} /> {brand.place}, Andhra Pradesh</p><a href={brand.phoneHref}><Phone size={19} /> {brand.phone}</a></div>
    <div className="button-row"><Link className="button button-dark" href="/bespoke/#consultation">Consultation form <ArrowRight size={16} /></Link>
      <Suspense fallback={<p role="status">Loading enquiry preview…</p>}><WhatsAppPreview /></Suspense></div>
  </section>;
}
