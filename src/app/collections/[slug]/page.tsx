import { notFound } from "next/navigation";
import { categories } from "@/data/catalogue";
import { Catalogue } from "@/components/catalogue";
import { BackLink } from "@/components/shell";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const match = categories.find(item => item.slug === slug);
  return { title: match?.name ?? "Collection", description: match?.description };
}
export default async function Collection({ params }: Props) {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) notFound();
  return <section className="wrap inner-page">
    <BackLink href="/collections/">All collections</BackLink>
    <div className="page-heading"><p className="eyebrow">Proposed collection</p><h1>{category.name}</h1><p>{category.description}</p></div>
    <Catalogue category={slug} />
  </section>;
}

