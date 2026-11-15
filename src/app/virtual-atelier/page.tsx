import { Suspense } from "react";
import { TryOnConcept } from "@/components/concepts";
import { BackLink } from "@/components/shell";
export const metadata = { title: "Virtual Atelier" };
export default function VirtualAtelier() {
  return <section className="wrap inner-page"><BackLink href="/collections/">Back to collections</BackLink><div className="page-heading"><h1>Virtual Atelier</h1><p>Try a concept for personalized fashion visualization.</p></div><Suspense fallback={<p role="status">Loading concept…</p>}><TryOnConcept /></Suspense></section>;
}
