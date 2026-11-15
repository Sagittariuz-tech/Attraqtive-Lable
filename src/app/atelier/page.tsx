import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/media";
export const metadata = { title: "The Atelier" };
export default function Atelier() {
  return <>
    <section className="editorial-band editorial-intro">
      <div className="editorial-image"><Photo image="atelier" alt="Illustrative scene of a couture sketch and embroidery materials" priority /></div>
      <div className="editorial-copy"><p className="eyebrow">Our Atelier · Illustrative editorial</p><h1>It starts with<br />the details.</h1><p>A fabric, a silhouette, a detail you return to. Bring those ideas into a private conversation about what you want to wear and how you want it to feel.</p><Link className="button button-outline" href="/bespoke/">Explore bespoke couture <ArrowRight size={16} /></Link></div>
    </section>
    <section className="wrap section"><div className="section-heading"><h2>In the consultation</h2></div><div className="journey">
      <div><h3>Fabric</h3><p>Discuss weight, movement and texture for the occasion.</p></div>
      <div><h3>Silhouette</h3><p>Consider volume, proportion and the movement you want.</p></div>
      <div><h3>Finishing</h3><p>Explore where embroidery or embellishment can draw the eye.</p></div>
    </div></section>
  </>;
}
