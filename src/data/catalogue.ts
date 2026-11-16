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
  { slug: "menswear", name: "Men’s Occasionwear", image: "sherwani", description: "Tailored sherwanis and bandhgalas for weddings and evening celebrations." },
];

const image = (role: MediaRole, image: string, alt: string): Media => ({ role, image, alt, origin: "illustrative" });

function readyToWear(sku: string, colour: string, swatch: string, price: number, sizes: string[], quantities: number[]): Product["commerce"] {
  return { kind: "retail", variants: sizes.map((size, index) => ({
    id: sku + "-" + size, colour, swatch, size, price, stock: quantities[index] ?? 0,
  })) };
}

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
    published: "2026-11-03", featured: true, media: [
      image("product", "olive-product", "Olive silk anarkali displayed on a dress form"),
      image("model", "olive", "A model wearing olive silk occasionwear"),
      image("detail", "olive-detail", "Close-up of the olive silk and gold woven border"),
    ],
    commerce: { kind: "retail", variants: ["S", "M", "L"].map(size => ({
      id: "AL-OLV-" + size, size, colour: "Olive", swatch: "#53553a", price: 1650000, stock: 3,
    })) },
  },
  {
    slug: "ivory-drape-ensemble", sku: "AL-IVR", title: "Ivory Drape Ensemble", category: "contemporary", collection: "The Occasion Edit",
    description: "An ivory drape with tonal embroidery and an elongated, softly structured silhouette.",
    fabric: "Organza", occasion: "Celebration", details: "Illustrative tonal embroidery and translucent layered draping.", care: "Care guidance is pending garment approval.",
    published: "2026-11-05", featured: true, media: [
      image("product", "ivory-product", "Ivory drape ensemble displayed on a dress form"),
      image("model", "ivory", "A model wearing a contemporary ivory draped ensemble"),
      image("detail", "ivory-detail", "Close-up of the ivory drape and tonal floral embroidery"),
    ],
    commerce: { kind: "consultation" },
  },
  {
    slug: "champagne-brocade-saree", sku: "AL-CHP", title: "Champagne Brocade Saree", category: "contemporary", collection: "The Evening Edit",
    description: "A softly lustrous champagne drape with a fine woven border.", fabric: "Brocade", occasion: "Celebration",
    details: "A tonal woven border frames the pleats and pallu.", care: "Care guidance is pending garment approval.",
    published: "2026-11-08", featured: false, media: [
      image("product", "champagne-product", "Champagne brocade saree displayed on a dress form"),
      image("model", "champagne", "Model in a champagne brocade saree"),
      image("detail", "champagne-detail", "Close-up of champagne brocade and its woven border"),
    ],
    commerce: readyToWear("AL-CHP", "Champagne", "#af8967", 1840000, ["One size"], [5]),
  },
  {
    slug: "midnight-satin-gown", sku: "AL-MID", title: "Midnight Satin Gown", category: "occasionwear", collection: "The Evening Edit",
    description: "A midnight-blue cocktail silhouette with a clean neckline and soft sheen.", fabric: "Satin", occasion: "Cocktail",
    details: "A softly fitted bodice and floor-length skirt.", care: "Care guidance is pending garment approval.",
    published: "2026-11-12", featured: false, media: [
      image("product", "midnight-product", "Midnight satin gown displayed on a dress form"),
      image("model", "midnight", "Model in a midnight-blue satin evening gown"),
      image("detail", "midnight-detail", "Close-up of the navy satin and gathered draping"),
    ],
    commerce: readyToWear("AL-MID", "Midnight", "#242c44", 2150000, ["S", "M", "L", "XL"], [1, 0, 2, 2]),
  },
  {
    slug: "rosewood-bridal-lehenga", sku: "AL-ROS", title: "Rosewood Bridal Lehenga", category: "bridal", collection: "Ceremony Edit",
    description: "A dusty rose bridal silhouette with fine silver-toned embroidery.", fabric: "Georgette", occasion: "Wedding",
    details: "Layered skirt, sheer dupatta and floral stitchwork.", care: "Care guidance is pending garment approval.",
    published: "2026-11-13", featured: false, media: [
      image("product", "rosewood-product", "Rosewood bridal lehenga displayed on a dress form"),
      image("model", "rosewood", "Model in a dusty rose bridal lehenga with floral embroidery"),
      image("detail", "rosewood-detail", "Close-up of dusty rose fabric with floral embroidery"),
    ],
    commerce: { kind: "consultation" },
  },
  {
    slug: "ivory-embroidered-sherwani", sku: "AL-SHE", title: "Ivory Embroidered Sherwani", category: "menswear", collection: "Ceremony Edit",
    description: "An ivory sherwani with a structured collar and muted gold embroidery.", fabric: "Jacquard", occasion: "Wedding",
    details: "Long tailored silhouette with embroidered front and collar.", care: "Care guidance is pending garment approval.",
    published: "2026-11-14", featured: false, media: [
      image("product", "sherwani-product", "Ivory embroidered sherwani displayed on a dress form"),
      image("model", "sherwani", "Model in an ivory embroidered sherwani"),
      image("detail", "sherwani-detail", "Close-up of ivory fabric with gold botanical embroidery"),
    ],
    commerce: readyToWear("AL-SHE", "Ivory", "#e6d7ba", 3190000, ["38", "40", "42", "44"], [1, 3, 2, 0]),
  },
  {
    slug: "seafoam-pearl-sharara", sku: "AL-SEA", title: "Seafoam Pearl Sharara", category: "contemporary", collection: "The Evening Edit",
    description: "A light seafoam ensemble with pearl accents and wide flowing trousers.", fabric: "Chiffon", occasion: "Celebration",
    details: "Soft layered pleats and pearl-toned finishing.", care: "Care guidance is pending garment approval.",
    published: "2026-11-11", featured: false, media: [
      image("product", "seafoam-product", "Seafoam sharara ensemble displayed on a dress form"),
      image("model", "seafoam", "Model in a seafoam sharara with pearl embroidery"),
      image("detail", "seafoam-detail", "Close-up of pearl embellishment on seafoam fabric"),
    ],
    commerce: readyToWear("AL-SEA", "Seafoam", "#80988c", 1780000, ["XS", "S", "M", "L"], [0, 2, 4, 1]),
  },
  {
    slug: "black-cherry-bandhgala", sku: "AL-BAN", title: "Black Cherry Bandhgala", category: "menswear", collection: "The Evening Edit",
    description: "A deep cherry velvet jacket with a crisp stand collar.", fabric: "Velvet", occasion: "Reception",
    details: "Tailored front, restrained buttons and a formal evening cut.", care: "Care guidance is pending garment approval.",
    published: "2026-11-15", featured: false, media: [
      image("product", "bandhgala-product", "Black cherry velvet bandhgala displayed on a dress form"),
      image("model", "bandhgala", "Model wearing a black cherry velvet bandhgala"),
      image("detail", "bandhgala-detail", "Close-up of black cherry velvet and gold jacket detailing"),
    ],
    commerce: readyToWear("AL-BAN", "Black Cherry", "#3c2631", 2490000, ["38", "40", "42", "44"], [2, 3, 0, 2]),
  },
];

export const findProduct = (slug: string) => products.find(product => product.slug === slug);
export const categoryName = (slug: string) => categories.find(category => category.slug === slug)?.name ?? slug;
