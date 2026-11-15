import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@/data/brand";
export const metadata = { title: "About" };
export default function About() {
  return <section className="wrap inner-page narrow"><div className="page-heading"><p className="eyebrow">{brand.place}</p><h1>Attraqtive Label</h1><p>A designer boutique in Visakhapatnam, Andhra Pradesh.</p></div>
    <p>This private preview introduces a digital home for exploring occasionwear and beginning a bespoke consultation. Collection names, garments and editorial imagery are illustrative and await boutique approval.</p>
    <Link className="button button-dark" href="/atelier/">Explore the atelier <ArrowRight size={16} /></Link>
  </section>;
}
