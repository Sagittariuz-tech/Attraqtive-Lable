"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, ShoppingBag, UserRound } from "lucide-react";
import { demoAccounts, useDemoAuth } from "@/lib/demo-auth";
import { receiptDate, receiptTotal, useDemoOrders } from "@/lib/demo-orders";
import { money } from "@/lib/commerce";
import { useShop } from "@/lib/store";
import { DemoSignIn } from "./demo-sign-in";

export function CustomerAccount() {
  const router = useRouter();
  const { ready, role, signOut } = useDemoAuth();
  const receipts = useDemoOrders(state => state.receipts).filter(receipt => receipt.customer);
  const saved = useShop(state => state.saved.length);
  const quantity = useShop(state => state.lines.reduce((count, line) => count + line.quantity, 0));

  if (!ready) return <p role="status">Loading demo account…</p>;
  if (!role) return <DemoSignIn onSignedIn={signedIn => { if (signedIn === "admin") router.push("/admin/"); }} />;
  if (role === "admin") return <div className="account-panel">
    <h2>Boutique owner</h2><p>{demoAccounts.admin.email}</p>
    <div className="button-row"><Link href="/admin/" className="button button-dark">Open owner dashboard <ArrowRight size={16} /></Link>
      <button className="button button-outline" type="button" onClick={signOut}>Sign out</button></div>
  </div>;

  return <div className="customer-account">
    <div className="account-tiles">
      <section className="account-panel"><UserRound size={20} /><h2>{demoAccounts.customer.name}</h2><p>{demoAccounts.customer.email}</p>
        <button className="plain-link" type="button" onClick={signOut}>Sign out of demo</button></section>
      <section className="account-panel"><Heart size={20} /><h2>Wishlist</h2><p>{saved} saved {saved === 1 ? "style" : "styles"}</p>
        <Link className="text-link" href="/wishlist/">Open wishlist <ArrowRight size={15} /></Link></section>
      <section className="account-panel"><ShoppingBag size={20} /><h2>Shopping bag</h2><p>{quantity} {quantity === 1 ? "item" : "items"} in this browser</p>
        <Link className="text-link" href="/cart/">Open shopping bag <ArrowRight size={15} /></Link></section>
    </div>
    <section className="account-panel">
      <h2>Demo order history</h2>
      <p className="fine">Sample receipts completed in this browser.</p>
      {receipts.length ? receipts.map(receipt => <details className="product-detail receipt" key={receipt.id}>
        <summary>{receipt.id} · {receiptDate(receipt.createdAt)} · {money(receiptTotal(receipt))}</summary>
        <p>{receipt.delivery === "boutique" ? "Boutique collection" : "Standard demo delivery"} · {receipt.fulfilment} · {receipt.payment}</p>
        <ul>{receipt.items.map(item => <li key={[item.sku, item.colour, item.size].join("/")}>{item.title} · {item.colour} / {item.size} · Qty {item.quantity}</li>)}</ul>
      </details>) : <p>Complete a demo checkout to see a receipt here.</p>}
    </section>
  </div>;
}
