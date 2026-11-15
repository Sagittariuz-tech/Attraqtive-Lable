import { Suspense } from "react";
import { Catalogue } from "@/components/catalogue";
export const metadata = { title: "Collections" };
export default function Collections() {
  return <section className="wrap inner-page">
    <div className="page-heading"><p className="eyebrow">Illustrative catalogue</p><h1>Collections</h1><p>Explore proposed bridal, occasion and contemporary silhouettes.</p></div>
    <Suspense fallback={<p role="status">Loading collections…</p>}><Catalogue /></Suspense>
  </section>;
}
