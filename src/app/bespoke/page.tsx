import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { brand } from "@/data/brand";
import { ConsultationForm } from "@/components/forms";
import { Photo } from "@/components/media";

export const metadata = { title: "Bespoke Couture" };

export default function Bespoke() {
  return <>
    <section className="editorial-band editorial-intro">
      <div className="editorial-image"><Photo image="atelier" alt="Illustrative atelier garment sketch and embroidery" priority /></div>
      <div className="editorial-copy"><p className="eyebrow">Bespoke couture</p><h1>From first idea<br />to final fitting.</h1><p>Bring an occasion, a silhouette or a detail you love. Explore what a private design consultation could look like.</p><a className="button button-outline" href="#consultation">Request a consultation <ArrowRight size={16} /></a></div>
    </section>
    <section className="wrap section"><div className="section-heading"><div><p className="eyebrow">Proposed design process</p><h2>The bespoke journey</h2></div></div>
      <div className="journey">{brand.journey.map(step => <div key={step.title}><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
    </section>
    <section className="wrap narrow section" id="consultation"><div className="section-heading"><h2>Private consultation</h2></div>
      <Suspense fallback={<p role="status">Loading consultation…</p>}><ConsultationForm /></Suspense>
    </section>
  </>;
}
