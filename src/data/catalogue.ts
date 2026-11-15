export type MediaRole = "product" | "model" | "detail" | "video";
export type Media = { role: MediaRole; image: string; alt: string; origin: "illustrative" | "authorized" };
export type Variant = { id: string; size: string; colour: string; swatch: string; price: number; salePrice?: number; stock: number; image?: string };
export type Product = {
  slug: string; sku: string; title: string; category: string; collection: string; description: string;
  fabric: string; occasion: string; details: string; care: string; published: string; featured: boolean;
  media: Media[]; commerce: { kind: "retail"; variants: Variant[] } | { kind: "consultation" };
};

export const categories = [
  { slug: "bridal", name: "Bridal Couture", image: "bridal", description: "Expressive embroidery, rich colour and silhouettes with a sense of ceremony." },
  { slug: "occasionwear", name: "Occasionwear", image: "olive", description: "Fluid layers and warm tones for the occasions you dress up for." },
  { slug: "contemporary", name: "Contemporary Ethnic", image: "ivory", description: "Indian draping and embroidery with a lighter, more contemporary silhouette." },
];

const image = (role: MediaRole, image: string, alt: string): Media => ({ role, image, alt, origin: "illustrative" });

export const products: Product[] = [
  {
    slug: "garnet-zardozi-lehenga", sku: "AL-GAR", title: "Garnet Zardozi Lehenga", category: "bridal", collection: "The Occasion Edit",
    description: "A deep garnet silhouette with antique-gold floral embroidery and a softly layered dupatta.",
    fabric: "Velvet", occasion: "Wedding", details: "Illustrative floral embroidery, wide skirt hem and a softly draped dupatta.",
    care: "For production, care instructions will be supplied with the confirmed garment.",
    published: "2026-11-01", featured: true,
    media: [image("product", "garnet-product", "Garnet lehenga displayed on a dress form"), image("model", "bridal", "A model in an illustrative garnet bridal lehenga"), image("model", "hero-mobile", "Alternate illustrative garnet lehenga styling in a sandstone arch"), image("detail", "garnet-detail", "Close-up of gold floral stitching on wine-red fabric")],
    commerce: { kind: "retail", variants: ["XS", "S", "M", "L", "XL"].map((size, index) => ({
      id: "AL-GAR-" + size, size, colour: "Garnet", swatch: "#542030", price: 2850000, stock: [0, 3, 4, 2, 1][index],
    })) },
  },
  {
    slug: "olive-silk-anarkali", sku: "AL-OLV", title: "Olive Silk Anarkali", category: "occasionwear", collection: "The Occasion Edit",
    description: "A fluid olive-toned occasion silhouette framed by understated gold detailing.",
    fabric: "Silk", occasion: "Reception", details: "Illustrative full-length proportions and a softly gathered skirt.", care: "Care guidance is pending garment approval.",
    published: "2026-11-03", featured: true, media: [image("model", "olive", "A model wearing olive silk occasionwear")],
    commerce: { kind: "retail", variants: ["S", "M", "L"].map(size => ({
      id: "AL-OLV-" + size, size, colour: "Olive", swatch: "#53553a", price: 1650000, stock: 3,
    })) },
  },
  {
    slug: "ivory-drape-ensemble", sku: "AL-IVR", title: "Ivory Drape Ensemble", category: "contemporary", collection: "The Occasion Edit",
    description: "An ivory drape with tonal embroidery and an elongated, softly structured silhouette.",
    fabric: "Organza", occasion: "Celebration", details: "Illustrative tonal embroidery and translucent layered draping.", care: "Care guidance is pending garment approval.",
    published: "2026-11-05", featured: true, media: [image("model", "ivory", "A model wearing a contemporary ivory draped ensemble")],
    commerce: { kind: "consultation" },
  },
];

export const findProduct = (slug: string) => products.find(product => product.slug === slug);
export const categoryName = (slug: string) => categories.find(category => category.slug === slug)?.name ?? slug;
