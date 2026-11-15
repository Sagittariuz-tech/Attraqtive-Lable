import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata = { title: "Account" };
export default function Account() {
  return <section className="wrap inner-page narrow"><div className="page-heading"><p className="eyebrow">Proposed for production</p><h1>Your account</h1><p>Customer accounts, order history and saved addresses will be available after the production storefront is approved.</p></div><Link className="button button-dark" href="/wishlist/">View your local wishlist <ArrowRight size={16} /></Link></section>;
}
