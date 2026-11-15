import Link from "next/link";
export default function Missing() {
  return <section className="wrap inner-page empty-state"><h1>Page unavailable</h1><p>Return to the storefront or browse the sample collections.</p><Link className="button button-dark" href="/collections/">Explore collections</Link></section>;
}
