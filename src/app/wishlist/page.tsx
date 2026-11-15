import { SavedProducts } from "@/components/wishlist";
export const metadata = { title: "Wishlist" };
export default function Wishlist() {
  return <section className="wrap inner-page"><div className="page-heading"><p className="eyebrow">Your saved styles</p><h1>Wishlist</h1><p>Keep a shortlist of pieces to revisit.</p></div><SavedProducts /></section>;
}
