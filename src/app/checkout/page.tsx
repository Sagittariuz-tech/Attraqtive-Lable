import { Checkout } from "@/components/forms";
import { BackLink } from "@/components/shell";
export const metadata = { title: "Demo Checkout" };
export default function CheckoutPage() {
  return <section className="wrap inner-page"><BackLink href="/cart/">Back to bag</BackLink>
    <div className="page-heading"><p className="eyebrow">Demonstration</p><h1>Demo checkout</h1><p>Use sample information to try the checkout experience.</p></div><Checkout /></section>;
}
