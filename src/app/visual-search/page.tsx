import { VisualSearchConcept } from "@/components/concepts";
import { BackLink } from "@/components/shell";
export const metadata = { title: "Find Your Inspiration" };
export default function VisualSearch() {
  return <section className="wrap inner-page"><BackLink href="/search/">Back to text search</BackLink><div className="page-heading"><h1>Find your inspiration</h1><p>Explore the proposed image-based search experience.</p></div><VisualSearchConcept /></section>;
}
