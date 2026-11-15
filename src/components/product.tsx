"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Expand, Share2, Sparkles, ZoomIn } from "lucide-react";
import type { Media, Product, Variant } from "@/data/catalogue";
import { money, unitPrice } from "@/lib/commerce";
import { useShop } from "@/lib/store";
import { useDemoAuth } from "@/lib/demo-auth";
import { Overlay } from "./shell";
import { Photo } from "./media";
import { SaveButton } from "./catalogue";
import { DemoSignIn } from "./demo-sign-in";

const perspectives: { role: Media["role"]; label: string }[] = [
  { role: "product", label: "Product View" }, { role: "model", label: "On Model" }, { role: "detail", label: "Details" }, { role: "video", label: "Video" },
];

function Gallery({ assets }: { assets: Media[] }) {
  const available = perspectives.filter(({ role }) => assets.some(asset => asset.role === role));
  const [active, setActive] = useState(available[0]?.role);
  const current = available.some(item => item.role === active) ? active : available[0]?.role;
  const media = assets.filter(asset => asset.role === current);
  if (!media.length) return <p className="notice">Product imagery is pending.</p>;
  return <section className="product-gallery" aria-label="Product gallery">
    <div className="view-tabs" aria-label="Gallery perspectives">{available.map(({ role, label }) =>
      <button key={role} aria-pressed={current === role} onClick={() => setActive(role)}>{label}</button>)}</div>
    <GallerySlides key={current} assets={media} />
    {media.some(asset => asset.origin === "illustrative") && <p className="fine">AI-generated illustrative imagery. Garment appearance and fit are representative.</p>}
  </section>;
}

function GallerySlides({ assets }: { assets: Media[] }) {
  const [index, setIndex] = useState(0);
  const [viewport, api] = useEmblaCarousel({
    watchDrag: assets.length > 1,
    breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
  });
  useEffect(() => {
    if (!api) return;
    const select = () => setIndex(api.selectedScrollSnap());
    api.on("select", select).on("reInit", select);
    return () => { api.off("select", select).off("reInit", select); };
  }, [api]);
  const active = assets[index] ?? assets[0];
  return <>
    <div className="gallery-stage">
      <div className="gallery-viewport" ref={viewport} tabIndex={assets.length > 1 ? 0 : undefined} role="group"
        aria-label={assets.length > 1 ? "Garment photographs. Use the left and right arrow keys to browse." : "Garment photograph"}
        onKeyDown={event => {
          if (event.key === "ArrowRight") { event.preventDefault(); api?.scrollNext(); }
          if (event.key === "ArrowLeft") { event.preventDefault(); api?.scrollPrev(); }
        }}><div className="gallery-track">
        {assets.map((asset, position) => <div className="gallery-slide" aria-hidden={position !== index} key={asset.image}><Photo {...asset} priority={position === 0} /></div>)}
      </div></div>
      {assets.length > 1 && <div className="gallery-arrows">
        <button className="icon-button" aria-label="Previous photograph" aria-disabled={index === 0} onClick={() => api?.scrollPrev()}><ArrowLeft /></button>
        <button className="icon-button" aria-label="Next photograph" aria-disabled={index === assets.length - 1} onClick={() => api?.scrollNext()}><ArrowRight /></button>
      </div>}
      <Overlay trigger={<button className="icon-button expand-button" aria-label="Enlarge image"><Expand size={20} /></button>}
        title="Garment image" description={active.alt}><ImageViewer key={active.image} asset={active} /></Overlay>
    </div>
    {assets.length > 1 && <div className="thumbnails">{assets.map((asset, position) =>
      <button key={asset.image} aria-label={"View image " + (position + 1)} aria-pressed={position === index} onClick={() => api?.scrollTo(position)}><Photo image={asset.image} alt="" /></button>)}</div>}
  </>;
}

function ImageViewer({ asset }: { asset: Media }) {
  const [zoomed, setZoomed] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const frame = viewport.current;
    if (zoomed && frame) frame.scrollTo((frame.scrollWidth - frame.clientWidth) / 2, (frame.scrollHeight - frame.clientHeight) / 2);
  }, [zoomed]);
  return <>
    <div className="viewer-controls"><button type="button" className="button button-outline" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>
      <ZoomIn size={17} /> 2× zoom
    </button></div>
    <div ref={viewport} className="viewer-viewport" data-zoomed={zoomed} tabIndex={zoomed ? 0 : undefined} role="region" aria-label="Garment photograph">
      <div className="fullscreen-image"><Photo {...asset} /></div>
    </div>
  </>;
}

function PurchaseButton({ product, variant, onFeedback }: { product: Product; variant?: Variant; onFeedback: (message: string) => void }) {
  const params = useSearchParams();
  const [signInOpen, setSignInOpen] = useState(false);
  const { role, ready } = useDemoAuth();
  const saved = useShop(state => state.saved.includes(product.slug));
  const add = useShop(state => state.add);
  const move = useShop(state => state.moveSavedToBag);
  const quantity = useShop(state => state.lines.find(line => line.id === variant?.id)?.quantity ?? 0);
  const fromWishlist = params.get("from") === "wishlist" && saved;
  const atLimit = !!variant && quantity >= variant.stock;
  function purchase() {
    if (!variant?.stock) { onFeedback("Select an available size to add this style."); return; }
    const currentQuantity = useShop.getState().lines.find(line => line.id === variant.id)?.quantity ?? 0;
    if (currentQuantity >= variant.stock) { onFeedback("The sample limit has been reached."); return; }
    if (fromWishlist) {
      onFeedback(move(product.slug, variant.id) ? "Moved from your wishlist to your shopping bag." : "This style could not be moved. Check your bag and try another size.");
      return;
    }
    add(variant.id);
    onFeedback("Added to your shopping bag.");
  }

  return <Overlay open={signInOpen} onOpenChange={setSignInOpen}
    trigger={<button className="button button-dark" disabled={atLimit || !ready} onClick={event => {
      event.preventDefault();
      if (!variant?.stock || role === "customer") purchase();
      else setSignInOpen(true);
    }}>{atLimit ? "Sample limit reached" : fromWishlist ? "Move to bag" : "Add to bag"}</button>}
    title="Sign in to add to bag" description="Sign in as the demo customer to keep the selected garment, colour and size.">
    <div className="overlay-body">
      <p className="pending-item">{product.title} · {variant?.colour} · {variant?.size}</p>
      <DemoSignIn allowed="customer" onSignedIn={() => { setSignInOpen(false); purchase(); }} />
      <button className="plain-link" type="button" onClick={() => setSignInOpen(false)}>Keep browsing</button>
    </div>
  </Overlay>;
}

export function ProductPresentation({ product }: { product: Product }) {
  const variants: Variant[] = product.commerce.kind === "retail" ? product.commerce.variants : [];
  const colours = [...new Map(variants.map(variant => [variant.colour, variant.swatch]))];
  const [colour, setColour] = useState(colours[0]?.[0] ?? "");
  const [size, setSize] = useState("");
  const [feedback, setFeedback] = useState("");
  const [share, setShare] = useState("");
  const variant = variants.find(item => item.size === size && item.colour === colour);
  const price = variant ? unitPrice(variant) : variants.length ? Math.min(...variants.map(unitPrice)) : null;
  const selectedMedia = variant?.image ? [{ role: "product", image: variant.image, alt: product.title + " in " + colour, origin: "illustrative" } satisfies Media, ...product.media] : product.media;
  const enquiry = "/bespoke/?garment=" + encodeURIComponent(product.title);

  return <div className="product-layout">
    <Gallery assets={selectedMedia} />
    <div className="product-info">
      <p className="eyebrow">{product.collection} · Sample garment</p>
      <h1>{product.title}</h1><p className="detail-price">{price === null ? "By consultation" : money(price) + " · Demo price"}</p>
      <p className="product-description">{product.description}</p>
      {!!variants.length && <fieldset className="variant-group" id="product-options"><legend>Colour · {colour}</legend><div className="options">
        {colours.map(([name, swatch]) => <button key={name} type="button" className="swatch" style={{ backgroundColor: swatch }} aria-label={name} aria-pressed={name === colour} onClick={() => { setColour(name); setSize(""); setFeedback(""); }} />)}
      </div></fieldset>}
      {!!variants.length && <div>
        <fieldset className="variant-group"><legend>Size</legend><div className="options">{variants.filter(item => item.colour === colour).map(item =>
          <button key={item.id} type="button" className="size-option" disabled={!item.stock} aria-pressed={size === item.size} onClick={() => { setSize(item.size); setFeedback(""); }}>{item.size}</button>)}</div></fieldset>
        <Overlay trigger={<button className="plain-link">Size guide</button>} title="Size guide" description="Sizing information for illustrative product samples"><p className="overlay-body">Sizes illustrate the selection experience. Boutique-approved measurements and fitting guidance will be added with the live catalogue.</p></Overlay>
        <p className="fine">{variant ? "Sample availability: " + variant.stock : "Select a size to see sample availability."}</p>
      </div>}
      <div className="product-actions">
        {variants.length ? <Suspense fallback={<button className="button button-dark" disabled>Add to bag</button>}>
          <PurchaseButton product={product} variant={variant} onFeedback={message => { setShare(""); setFeedback(message); }} />
        </Suspense> : <Link className="button button-dark" href={enquiry}>Request a consultation <ArrowRight size={16} /></Link>}
        <SaveButton product={product} />
        <button className="icon-button share-button" aria-label="Copy product link" onClick={async () => {
          try { await navigator.clipboard.writeText(window.location.href); setShare("Product link copied."); }
          catch { setShare("You can copy the product address from your browser."); }
        }}><Share2 size={18} /></button>
      </div>
      <p className="feedback" role="status">{feedback || share}</p>
      <details className="product-detail"><summary>Fabric & embroidery</summary><p>{product.fabric}. {product.details}</p></details>
      <details className="product-detail"><summary>Care & delivery</summary><p>{product.care} Delivery timing will be confirmed by the boutique.</p></details>
      <div className="product-service-links"><Link href={enquiry}>Ask about customization <ArrowRight size={14} /></Link>
        <Link href={"/contact/?garment=" + encodeURIComponent(product.title)}>Stylist assistance <ArrowRight size={14} /></Link>
        <Link href={"/virtual-atelier/?garment=" + encodeURIComponent(product.slug)}><Sparkles size={15} /> Virtual Atelier concept</Link></div>
    </div>
  </div>;
}
