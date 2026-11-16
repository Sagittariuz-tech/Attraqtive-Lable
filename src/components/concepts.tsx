"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ImageIcon, Sparkles } from "lucide-react";
import { findProduct, products } from "@/data/catalogue";
import { Photo } from "./media";
import { ProductCard } from "./catalogue";

const examples = [
  { id: "bridal", title: "Garnet embroidery", matches: [products[0]] },
  { id: "olive", title: "Olive silk silhouette", matches: [products[1], products[2]] },
  { id: "atelier", title: "Custom design sketch", matches: [] },
];

export function VisualSearchConcept() {
  const [chosen, setChosen] = useState(examples[0]);
  const [result, setResult] = useState<(typeof examples)[number]>();
  return <>
    <p className="notice">Concept preview. Choose an example to see a predefined result layout. Personal image uploads are unavailable during this preview.</p>
    <div className="concept-input"><ImageIcon size={27} strokeWidth={1.25} /><h2>Choose a sample reference</h2>
      <div className="concept-choices">{examples.map(example => <button key={example.id} aria-pressed={example === chosen} onClick={() => { setChosen(example); setResult(undefined); }}>
        <span className="concept-thumb"><Photo image={example.id} alt="" sizes="120px" /></span>{example.title}</button>)}</div>
      <button className="button button-dark" onClick={() => setResult(chosen)}>View sample results <ArrowRight size={16} /></button>
    </div>
    {result && <section className="concept-results" aria-label="Representative results">
      {result.matches.length ? <><h2>Example results</h2><p className="fine">Preselected styles showing how future catalogue matches could appear.</p><div className="product-grid">{result.matches.map(product => <ProductCard key={product.slug} product={product} />)}</div></> :
        <div className="empty-state"><h2>No sample styles for this reference</h2><p>Bring your inspiration to a bespoke consultation.</p><Link href="/bespoke/" className="button button-dark">Request a custom design <ArrowRight size={16} /></Link></div>}
    </section>}
  </>;
}

export function TryOnConcept() {
  const params = useSearchParams();
  const [garment, setGarment] = useState(findProduct(params.get("garment") ?? "") ?? products[0]);
  const [showResult, setShowResult] = useState(false);
  const [comparison, setComparison] = useState(50);
  const [consent, setConsent] = useState(false);
  const productImage = garment.media.find(media => media.role === "product");
  const modelImage = garment.media.find(media => media.role === "model");

  return <>
    <p className="notice">Concept preview. This sample comparison uses prepared illustrations and leaves photo upload unavailable. Actual fit, sizing, drape, texture and colour can differ.</p>
    <div className="concept-layout">
      <div className="concept-input">
        <Sparkles size={27} strokeWidth={1.25} /><h2>Try the preview</h2>
        <label className="concept-select">Sample garment<select value={garment.slug} onChange={event => {
          const selected = findProduct(event.target.value);
          if (selected) { setGarment(selected); setShowResult(false); setComparison(50); }
        }}>{products.map(product => <option key={product.slug} value={product.slug}>{product.title}</option>)}</select></label>
        {productImage && modelImage ? <>
          <label className="consent"><input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); if (!event.target.checked) setShowResult(false); }} />I understand this uses two illustrative views of the selected garment.</label>
          <button className="button button-dark" disabled={!consent} onClick={() => setShowResult(true)}>View sample comparison <ArrowRight size={16} /></button>
        </> : <div className="notice">
          <p>A paired comparison is unavailable for this style. Choose Garnet Zardozi Lehenga to try the sample comparison.</p>
          <Link className="text-link" href={"/products/" + garment.slug + "/"}>View this garment <ArrowRight size={16} /></Link>
        </div>}
      </div>
      {showResult && productImage && modelImage && <section className="comparison-panel" aria-label="Illustrative comparison">
        <div className="comparison-image">
          <Photo {...productImage} />
          <div className="comparison-layer" style={{ clipPath: "inset(0 " + (100 - comparison) + "% 0 0)" }}><Photo {...modelImage} /></div>
          <div className="comparison-line" style={{ left: comparison + "%" }} />
        </div>
        <label>Compare illustrative images <input type="range" min="0" max="100" value={comparison} onChange={event => setComparison(Number(event.target.value))} /></label>
        <button className="plain-link" onClick={() => { setShowResult(false); setComparison(50); }}>Clear comparison</button>
      </section>}
    </div>
  </>;
}
