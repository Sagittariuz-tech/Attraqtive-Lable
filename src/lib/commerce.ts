import { categoryName, products, type Product, type Variant } from "../data/catalogue";

export type Line = { id: string; quantity: number };
export type Stock = ReadonlyMap<string, number>;
export const availableUnits = (variant: Variant, stock?: Stock) => stock?.get(variant.id) ?? variant.stock;
export const money = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: paise % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(paise / 100);
export const unitPrice = (variant: Variant) => variant.salePrice ?? variant.price;
export const productPrice = (product: Product) => product.commerce.kind === "retail" ? Math.min(...product.commerce.variants.map(unitPrice)) : null;

const variants = new Map(products.flatMap(product => product.commerce.kind === "retail"
  ? product.commerce.variants.map(variant => [variant.id, { product, variant }] as const)
  : []));

export function normalizeLines(lines: readonly unknown[], stock?: Stock): Line[] {
  const result = new Map<string, number>();
  for (const line of lines) {
    if (!line || typeof line !== "object" || !("id" in line) || !("quantity" in line)) continue;
    const { id, quantity } = line;
    if (typeof id !== "string" || typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 1) continue;
    const item = variants.get(id);
    if (!item) continue;
    const available = availableUnits(item.variant, stock);
    if (!available) continue;
    result.set(id, Math.min(available, quantity + (result.get(id) ?? 0)));
  }
  return Array.from(result, ([id, quantity]) => ({ id, quantity }));
}

export function changeQuantity(lines: Line[], id: string, quantity: number, stock?: Stock) {
  return normalizeLines([...lines.filter(line => line.id !== id), { id, quantity }], stock);
}

export function resolveBag(lines: Line[], stock?: Stock) {
  return normalizeLines(lines, stock).flatMap(line => {
    const item = variants.get(line.id);
    return item ? [{ ...line, ...item, total: unitPrice(item.variant) * line.quantity }] : [];
  });
}

export type Filters = { query: string; category: string; colour: string; size: string; fabric: string; occasion: string; availability: string; price: string; sort: string };
export const emptyFilters: Filters = { query: "", category: "", colour: "", size: "", fabric: "", occasion: "", availability: "", price: "", sort: "" };

export function filterProducts(filters: Filters, source = products, stock?: Stock) {
  const terms = filters.query.toLowerCase().trim().split(/\s+/);
  const result = source.filter(product => {
    const variants = product.commerce.kind === "retail" ? product.commerce.variants : [];
    const search = [product.title, categoryName(product.category), product.collection, product.fabric, product.occasion, ...variants.map(variant => variant.colour)].join(" ").toLowerCase();
    const price = productPrice(product);
    const matchingVariants = variants.filter(variant => (!filters.colour || variant.colour === filters.colour) && (!filters.size || variant.size === filters.size));
    return terms.every(term => search.includes(term))
      && (!filters.category || filters.category === product.category)
      && (!filters.fabric || filters.fabric === product.fabric)
      && (!filters.occasion || filters.occasion === product.occasion)
      && (!(filters.colour || filters.size) || matchingVariants.some(variant => availableUnits(variant, stock) > 0))
      && (filters.availability !== "retail" || matchingVariants.some(variant => availableUnits(variant, stock) > 0))
      && (filters.availability !== "consultation" || product.commerce.kind === "consultation")
      && (!filters.price || (price !== null && (filters.price === "under" ? price < 2000000 : price >= 2000000)));
  });
  return result.sort((a, b) => {
    const priceA = productPrice(a);
    const priceB = productPrice(b);
    if (filters.sort === "low" || filters.sort === "high") {
      if (priceA === null) return priceB === null ? 0 : 1;
      if (priceB === null) return -1;
      return filters.sort === "low" ? priceA - priceB : priceB - priceA;
    }
    return filters.sort === "new" ? b.published.localeCompare(a.published) : 0;
  });
}
