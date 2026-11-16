import Link from "next/link";
import { Catalogue } from "@/components/catalogue";
export const metadata = { title: "Search" };
export default function SearchPage() {
  return <section className="wrap inner-page">
    <div className="page-heading"><h1>Find your style</h1><p>Search the illustrative catalogue by garment, fabric, category or occasion.</p></div>
    <Catalogue search />
    <p className="search-help">Have a specific design in mind? <Link className="plain-link" href="/bespoke/">Ask the atelier</Link>.</p>
  </section>;
}
