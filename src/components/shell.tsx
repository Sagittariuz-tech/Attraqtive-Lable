"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/catalogue";
import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { brand } from "@/data/brand";
import { useShop } from "@/lib/store";
import { useDemoAuth } from "@/lib/demo-auth";
import { receiptStorageKey, useDemoOrders } from "@/lib/demo-orders";
import { enquiryStorageKey, useDemoEnquiries } from "@/lib/demo-enquiries";
import { BagContents } from "./shopping";
import type { ReactNode } from "react";

const navigation = [
  ["Collections", "/collections/"], ["New Arrivals", "/collections/?sort=new"],
  ["The Atelier", "/atelier/"], ["Bespoke", "/bespoke/"], ["About", "/about/"], ["Contact", "/contact/"],
];

export function Wordmark() {
  return <Link className="wordmark" href="/" aria-label="Attraqtive Label home">Attraqtive<span> Label</span></Link>;
}

export function Overlay({ trigger, title, description, children, drawer = false, open, onOpenChange }: {
  trigger: ReactNode; title: string; description: string; children: ReactNode; drawer?: boolean;
  open?: boolean; onOpenChange?: (open: boolean) => void;
}) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="scrim" />
      <Dialog.Content className={drawer ? "overlay drawer" : "overlay modal"}>
        <header className="overlay-head">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close className="icon-button" aria-label="Close"><X size={23} /></Dialog.Close>
        </header>
        <Dialog.Description className="sr-only">{description}</Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function Header() {
  const pathname = usePathname();
  const count = useShop(state => state.lines.reduce((total, line) => total + line.quantity, 0));
  const role = useDemoAuth(state => state.role);
  const accountHref = role === "admin" ? "/admin/" : "/account/";
  const accountLabel = role === "admin" ? "Dashboard" : role === "customer" ? "Account" : "Sign in";
  useEffect(() => {
    void Promise.allSettled([
      useShop.persist.rehydrate(), useDemoOrders.persist.rehydrate(), useDemoAuth.persist.rehydrate(), useDemoEnquiries.persist.rehydrate(),
    ]).then(() => useDemoAuth.setState({ ready: true }));
    function sync(event: StorageEvent) {
      if (event.key === receiptStorageKey) void useDemoOrders.persist.rehydrate();
      if (event.key === enquiryStorageKey) void useDemoEnquiries.persist.rehydrate();
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="announcement">{brand.announcement}</div>
    <header className="site-header">
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.slice(0, 4).map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}
      </nav>
      <div className="mobile-nav">
        <Overlay trigger={<button className="icon-button" aria-label="Open navigation"><Menu size={23} /></button>}
          title="Explore Attraqtive" description="Storefront navigation" drawer>
          <nav aria-label="Mobile navigation" className="menu-links">
            {[...navigation, ["Lookbook", "/lookbook/"], ["Search", "/search/"], [accountLabel, accountHref], ["Wishlist", "/wishlist/"]].map(([name, href]) =>
              <Dialog.Close asChild key={href}><Link href={href}>{name}<ArrowRight size={18} /></Link></Dialog.Close>)}
          </nav>
        </Overlay>
      </div>
      <Wordmark />
      <nav className="utilities" aria-label="Shop navigation">
        <Link className="icon-button header-search" href="/search/" aria-label="Search"><Search size={20} /></Link>
        <Link className="account-link" href={accountHref} data-signed={!!role}><UserRound size={19} /><span>{accountLabel}</span></Link>
        <Link className="icon-button desktop-utility" href="/wishlist/" aria-label="Wishlist"><Heart size={20} /></Link>
        <Overlay trigger={<button className="icon-button bag-trigger" aria-label={count ? "Open shopping bag, " + count + (count === 1 ? " item" : " items") : "Open shopping bag"}><ShoppingBag size={20} />{count > 0 && <span>{count}</span>}</button>}
          title="Shopping Bag" description="Review sample items and go to demonstration checkout" drawer>
          <BagContents drawer />
        </Overlay>
      </nav>
    </header>
    <nav className="shop-rail rail" aria-label="Shop by occasion">
      {categories.map(category => <Link key={category.slug} href={"/collections/" + category.slug + "/"}
        aria-label={"Shop " + category.name} aria-current={pathname === "/collections/" + category.slug + "/" ? "page" : undefined}>{category.name}</Link>)}
      <Link href="/lookbook/">Lookbook</Link>
    </nav>
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-main wrap">
      <div><Wordmark /><p>Designer couture in {brand.place}.</p><a href={brand.phoneHref}>{brand.phone}</a></div>
      <nav aria-label="Discover"><h2>Discover</h2><Link href="/collections/">Collections</Link><Link href="/lookbook/">Lookbook</Link><Link href="/atelier/">Our Atelier</Link><Link href="/bespoke/">Bespoke consultations</Link></nav>
      <nav aria-label="Client care"><h2>Client care</h2><Link href="/contact/">Contact</Link><Link href="/about/">About</Link><Link href="/wishlist/">Wishlist</Link><Link href="/policies/">Shipping, returns and policies</Link></nav>
    </div>
    <div className="footer-line wrap"><span>© Attraqtive Label</span><span>Private demo by {brand.partner}</span></div>
  </footer>;
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="back-link" href={href}><ArrowLeft size={15} />{children}</Link>;
}
