import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/catalogue";
import { Photo } from "@/components/media";
import { Overlay } from "@/components/shell";
export const metadata = { title: "Lookbook" };
export default function Lookbook() {
  return <section className="wrap inner-page"><div className="page-heading"><p className="eyebrow">Illustrative editorial</p><h1>The lookbook</h1><p>Three studies in colour, texture and the way a garment falls.</p></div>
    <div className="lookbook">{products.map(product => {
      const look = product.media.find(media => media.role === "model") ?? product.media[0];
      return <article key={product.slug}>
        <Overlay trigger={<button className="look-button" aria-label={"Enlarge " + product.title}><Photo {...look} /></button>}
          title={product.title} description="Illustrative lookbook image"><div className="fullscreen-image"><Photo {...look} /></div></Overlay>
        <div><h2>{product.title}</h2><p>{product.description}</p><Link href={"/products/" + product.slug + "/"} className="text-link">View garment <ArrowRight size={16} /></Link></div>
      </article>;
    })}</div>
  </section>;
}
