import { notFound } from "next/navigation";
import { findProduct, products } from "@/data/catalogue";
import { BackLink } from "@/components/shell";
import { ProductPresentation } from "@/components/product";
import { ProductCard } from "@/components/catalogue";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const product = findProduct((await params).slug);
  return { title: product?.title ?? "Garment", description: product?.description };
}
export default async function ProductPage({ params }: Props) {
  const product = findProduct((await params).slug);
  if (!product) notFound();
  return <div className="wrap inner-page">
    <BackLink href={"/collections/" + product.category + "/"}>Back to collection</BackLink>
    <ProductPresentation product={product} />
    <section className="related"><h2>Explore other styles</h2><div className="product-grid">{products.filter(item => item.slug !== product.slug).map(item => <ProductCard product={item} key={item.slug} />)}</div></section>
  </div>;
}
