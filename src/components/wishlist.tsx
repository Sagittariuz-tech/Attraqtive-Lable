"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { ProductCard } from "./catalogue";
import { useShop } from "@/lib/store";
import { products } from "@/data/catalogue";

export function SavedProducts() {
  const saved = useShop(state => state.saved);
  const items = products.filter(item => saved.includes(item.slug));
  return items.length ? <div className="product-grid">{items.map(item => <ProductCard key={item.slug} product={item}
    action={item.commerce.kind === "retail" && <Link className="text-link" href={"/products/" + item.slug + "/?from=wishlist#product-options"}>
      Move to bag<span className="sr-only"> · {item.title}</span><ArrowRight size={15} />
    </Link>} />)}</div> :
    <div className="empty-state"><Heart size={26} strokeWidth={1.3} /><h2>Nothing saved yet</h2><p>Use the heart on a sample garment to save it here.</p><Link className="button button-dark" href="/collections/">Explore collections <ArrowRight size={16} /></Link></div>;
}
