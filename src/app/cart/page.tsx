import { BagContents } from "@/components/shopping";
export const metadata = { title: "Shopping Bag" };
export default function Cart() {
  return <section className="wrap inner-page narrow"><div className="page-heading"><p className="eyebrow">Demonstration</p><h1>Shopping bag</h1></div><BagContents /></section>;
}
