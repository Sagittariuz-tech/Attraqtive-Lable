import Link from "next/link";
export const metadata = { title: "Policies" };
export default function Policies() {
  return <section className="wrap inner-page narrow"><div className="page-heading"><p className="eyebrow">Pending boutique approval</p><h1>Store policies</h1></div>
    {["Shipping", "Returns", "Privacy", "Terms"].map(title => <details className="product-detail" key={title}><summary>{title}</summary><p>Approved {title.toLowerCase()} information will be published before the store opens to customers.</p></details>)}
    <p>For a boutique enquiry, <Link className="plain-link" href="/contact/">contact Attraqtive Label</Link>.</p></section>;
}
