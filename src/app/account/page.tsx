import { CustomerAccount } from "@/components/customer-account";

export const metadata = { title: "Account" };

export default function Account() {
  return <section className="wrap inner-page narrow">
    <div className="page-heading"><p className="eyebrow">Demo accounts</p><h1>Your account</h1><p>Sign in to try the customer account or the boutique owner dashboard.</p></div>
    <CustomerAccount />
  </section>;
}
