"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { type ReactNode } from "react";
import { useShop } from "@/lib/store";
import { availableUnits, money, resolveBag, unitPrice } from "@/lib/commerce";
import { useDemoOrders } from "@/lib/demo-orders";
import { Photo } from "./media";

export function EmptyBag() {
  return <div className="empty-state"><ShoppingBag size={27} strokeWidth={1.25} /><h2>Your bag is empty</h2><p>Explore the sample collection to find a piece to try.</p></div>;
}

function DrawerLink({ drawer, children, href, className }: { drawer: boolean; children: ReactNode; href: string; className: string }) {
  const link = <Link href={href} className={className}>{children}</Link>;
  return drawer ? <Dialog.Close asChild>{link}</Dialog.Close> : link;
}

export function BagContents({ drawer = false }: { drawer?: boolean }) {
  const lines = useShop(state => state.lines);
  const stock = useDemoOrders(state => state.stock);
  const change = useShop(state => state.setQuantity);
  const save = useShop(state => state.saveLine);
  const items = resolveBag(lines);
  const subtotal = items.reduce((total, item) => total + item.total, 0);
  if (!items.length) return <div className="bag-empty"><EmptyBag /><DrawerLink drawer={drawer} href="/collections/" className="button button-dark">Explore collections <ArrowRight size={16} /></DrawerLink></div>;
  return <div className="bag-contents">
    <ul className="bag-lines">{items.map(({ id, product, variant, quantity, total }) => <li className="bag-line" key={id}>
      <div className="bag-image"><Photo {...product.media[0]} sizes="96px" /></div>
      <div>
        <DrawerLink drawer={drawer} href={"/products/" + product.slug + "/"} className="bag-name">{product.title}</DrawerLink>
        <p className="fine">{variant.colour} · {variant.size} · {money(unitPrice(variant))} each</p>
        <div className="quantity">
          <button className="icon-button" aria-label={"Decrease quantity of " + product.title + ", " + variant.size} disabled={quantity <= 1} onClick={() => change(id, quantity - 1)}><Minus size={15} /></button>
          <span aria-label="Quantity">{quantity}</span>
          <button className="icon-button" aria-label={"Increase quantity of " + product.title + ", " + variant.size} disabled={quantity >= availableUnits(variant, stock)} onClick={() => change(id, quantity + 1)}><Plus size={15} /></button>
        </div>
        <div className="bag-actions"><button className="plain-link" onClick={() => change(id, 0)}>Remove</button><button className="plain-link" onClick={() => save(id)}>Save for later</button></div>
      </div>
      <strong>{money(total)}</strong>
    </li>)}</ul>
    <div className="bag-summary">
      {items.some(item => item.quantity > availableUnits(item.variant, stock)) && <p className="notice">Sample availability changed. Review your quantities before placing the order.</p>}
      <p className="subtotal"><span>Sample subtotal</span><strong aria-live="polite">{money(subtotal)}</strong></p>
      <p className="fine">Demo prices in INR. Delivery is arranged separately.</p>
      <DrawerLink drawer={drawer} href="/checkout/" className="button button-dark">Demo checkout <ArrowRight size={16} /></DrawerLink>
      {drawer && <DrawerLink drawer href="/cart/" className="text-link">View shopping bag <ArrowRight size={15} /></DrawerLink>}
    </div>
  </div>;
}
