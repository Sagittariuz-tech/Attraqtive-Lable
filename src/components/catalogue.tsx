"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowRight, Camera, Heart, Search, SlidersHorizontal } from "lucide-react";
import { categories, categoryName, products, type Product } from "@/data/catalogue";
import { emptyFilters, filterProducts, money, productPrice, type Filters } from "@/lib/commerce";
import { useShop } from "@/lib/store";
import { useDemoOrders } from "@/lib/demo-orders";
import { useDemoAuth } from "@/lib/demo-auth";
import { Photo } from "./media";
import { Overlay } from "./shell";
import * as Dialog from "@radix-ui/react-dialog";

export function SaveButton({ product }: { product: Product }) {
  const saved = useShop(state => state.saved.includes(product.slug));
  const toggle = useShop(state => state.toggleSave);
  return <button className={"icon-button save-button" + (saved ? " saved" : "")} aria-label={(saved ? "Remove " : "Save ") + product.title + (saved ? " from wishlist" : "")} aria-pressed={saved} onClick={() => toggle(product.slug)}><Heart size={20} fill={saved ? "currentColor" : "none"} /></button>;
}

export function Price({ product }: { product: Product }) {
  const price = productPrice(product);
  return <span>{price === null ? "By consultation" : money(price) + " · Demo price"}</span>;
}

export function ProductCard({ product, action }: { product: Product; action?: ReactNode }) {
  const ready = useDemoAuth(state => state.ready);
  const href = "/products/" + product.slug + "/";
  const cover = product.media.find(asset => asset.role === "model") ?? product.media[0];
  const secondary = product.media.find(asset => asset.role === "detail");
  return <article className="product-card">
    <div className="product-picture">
      <Link href={href} aria-label={"View " + product.title} className="product-image">
        <Photo {...cover} sizes="(max-width: 700px) 50vw, (max-width: 1099px) 33vw, 25vw" />
        {secondary && <Photo {...secondary} className="secondary" sizes="(max-width: 700px) 50vw, (max-width: 1099px) 33vw, 25vw" />}
      </Link>
      <SaveButton product={product} />
    </div>
    <p className="eyebrow">{categoryName(product.category)}</p>
    <h3><Link href={href}>{product.title}</Link></h3>
    <div className="product-meta"><Price product={product} />
      <Overlay trigger={<button className="plain-link" disabled={!ready}>Quick view<span className="sr-only"> of {product.title}</span></button>}
        title={product.title} description="Sample garment preview">
        <div className="quick-view"><div className="quick-image"><Photo {...cover} /></div>
        <div><p>{product.description}</p><p><Price product={product} /></p><p className="fine">Illustrative imagery</p><Dialog.Close asChild><Link className="button button-dark" href={href}>View garment <ArrowRight size={15} /></Link></Dialog.Close></div></div>
      </Overlay>
    </div>
    {action}
  </article>;
}

const unique = (values: string[]) => [...new Set(values)].map(value => [value, value]);
const variantData = products.flatMap(product => product.commerce.kind === "retail" ? product.commerce.variants : []);
const controls: [keyof Filters, string, string[][]][] = [
  ["category", "Category", categories.map(category => [category.slug, category.name])],
  ["price", "Price", [["under", "Under ₹20,000"], ["over", "₹20,000 and above"]]],
  ["colour", "Colour", unique(variantData.map(variant => variant.colour))],
  ["size", "Size", unique(variantData.map(variant => variant.size))],
  ["fabric", "Fabric", unique(products.map(product => product.fabric))],
  ["occasion", "Occasion", unique(products.map(product => product.occasion))],
  ["availability", "Availability", [["retail", "Sample stock available"], ["consultation", "By consultation"]]],
];

export function SortedCatalogue() {
  const params = useSearchParams();
  const sort = params.get("sort") ?? "";
  return <Catalogue key={sort} sort={sort} />;
}

export function Catalogue({ category = "", search = false, sort = "" }: { category?: string; search?: boolean; sort?: string }) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, category, sort });
  const [visible, setVisible] = useState(6);
  const stock = useDemoOrders(state => state.stock);
  const results = filterProducts(filters, products, stock);
  const update = (key: keyof Filters, value: string) => {
    setFilters(current => ({ ...current, [key]: value }));
    setVisible(6);
  };
  const reset = () => { setFilters({ ...emptyFilters, category, sort }); setVisible(6); };

  return <>
    {search && <div className="search-controls">
      <label className="search-box"><Search size={21} /><span className="sr-only">Search the catalogue</span><input type="search" value={filters.query} onChange={event => update("query", event.target.value)} placeholder="Try “silk” or “bridal”" /></label>
      <Link className="button button-outline" href="/visual-search/"><Camera size={18} /> Search by image</Link>
    </div>}
    {search && !filters.query && <div className="collection-nav" aria-label="Suggested searches">{["Bridal", "Silk", "Organza"].map(term => <button key={term} type="button" onClick={() => update("query", term)} className="text-link">{term}<ArrowRight size={14} /></button>)}</div>}
    {!category && !search && <nav className="collection-nav" aria-label="Collection categories">{categories.map(item => <Link key={item.slug} href={"/collections/" + item.slug + "/"}>{item.name}<ArrowRight size={14} /></Link>)}</nav>}
    <div className="filter-bar">
      <details className="filters">
        <summary><SlidersHorizontal size={16} /> Filters</summary>
        <div className="filter-grid">
          {controls.filter(([key]) => key !== "category" || !category).map(([key, label, options]) =>
            <label key={key}>{label}<select value={filters[key]} onChange={event => update(key, event.target.value)}>
              <option value="">All</option>{options.map(([value, name]) => <option value={value} key={value}>{name}</option>)}
            </select></label>)}
          <button className="plain-link" onClick={reset}>Reset filters</button>
        </div>
      </details>
      <p className="result-count" aria-live="polite">{results.length} {results.length === 1 ? "sample style" : "sample styles"}</p>
      <label className="sort-control"><span>Sort</span><select aria-label="Sort products" value={filters.sort} onChange={event => update("sort", event.target.value)}>
        <option value="">Featured</option><option value="new">Newest</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option>
      </select></label>
    </div>
    {results.length ? <div className="product-grid responsive-grid">{results.slice(0, visible).map(product => <ProductCard product={product} key={product.slug} />)}</div> :
      <div className="empty-state"><h2>No sample styles found</h2><p>Try a different search or clear your filters.</p><button className="button button-dark" onClick={reset}>Clear filters</button></div>}
    {results.length > visible && <button className="button button-outline load-more" onClick={() => setVisible(value => value + 6)}>Load more</button>}
  </>;
}
