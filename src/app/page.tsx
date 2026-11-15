import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Photo } from "@/components/media";
import { EditorialMotion } from "@/components/editorial-motion";
import { ProductCard } from "@/components/catalogue";
import { brand } from "@/data/brand";
import { categories, products } from "@/data/catalogue";

export default function Home() {
  return <>
    <EditorialMotion />
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-media" data-hero-image><picture><source media="(max-width: 700px)" srcSet="/images/hero-mobile.webp" /><Image src="/images/hero.webp" alt="Illustrative fashion editorial of a garnet lehenga against a sandstone arch" fill fetchPriority="high" sizes="100vw" /></picture></div>
      <div className="hero-gradient" />
      <div className="hero-content wrap" data-hero-copy>
        <p className="eyebrow">Attraqtive Label · Visakhapatnam</p>
        <h1 id="hero-heading">An expression of<br /><em>individual elegance.</em></h1>
        <p className="hero-description">Thoughtfully considered couture for moments worth remembering.</p>
        <Link className="button button-light" href="/collections/">Explore the collection <ArrowRight size={16} /></Link>
      </div>
      <a href="#collections" className="hero-scroll" aria-label="Scroll to collections"><ArrowDown size={18} /></a>
      <span className="hero-credit">Illustrative campaign imagery</span>
    </section>

    <section className="wrap section" id="collections" data-reveal>
      <div className="section-heading"><div><p className="eyebrow">Proposed collections</p><h2>The occasion edit</h2></div><Link href="/collections/" className="text-link">View all collections <ArrowRight size={16} /></Link></div>
      <div className="category-grid">{categories.map(category => <Link href={"/collections/" + category.slug + "/"} key={category.slug} className="category-card">
        <div className="category-image"><Photo image={category.image} alt={category.name + " illustrative fashion study"} sizes="(max-width: 700px) 80vw, 33vw" /></div>
        <div className="category-label"><h3>{category.name}</h3><ArrowRight size={20} /></div>
      </Link>)}</div>
    </section>

    <section className="editorial-band" data-reveal>
      <div className="editorial-image"><Photo image="atelier" alt="Illustrative atelier scene of hands working over a garment sketch" /></div>
      <div className="editorial-copy">
        <p className="eyebrow">The Atelier</p><h2>Couture begins<br />with a conversation.</h2>
        <p>Explore fabric, silhouette and finish with the atelier. A private consultation brings together the details that make a garment yours.</p>
        <Link className="button button-outline" href="/atelier/">Discover the atelier <ArrowRight size={16} /></Link>
      </div>
    </section>

    <section className="section wrap" data-reveal>
      <div className="section-heading"><div><p className="eyebrow">Illustrative catalogue</p><h2>Selected creations</h2></div><Link className="text-link" href="/lookbook/">Open the lookbook <ArrowRight size={16} /></Link></div>
      <div className="product-grid">{products.filter(product => product.featured).map(product => <ProductCard key={product.slug} product={product} />)}</div>
    </section>
    <section className="consultation-band" data-reveal>
      <p className="eyebrow">{brand.place}</p><h2>Made for your occasion</h2>
      <p>Start with a private styling or bespoke design consultation.</p>
      <Link href="/bespoke/" className="button button-light">Request a consultation <ArrowRight size={16} /></Link>
    </section>
  </>;
}
