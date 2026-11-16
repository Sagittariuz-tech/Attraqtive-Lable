# Attraqtive Label

**Private storefront demonstration by Sagittariuz**

Prepared for Attraqtive Label, a designer-wear boutique in Ram Nagar, Visakhapatnam.

This project presents an editorial fashion storefront and demonstrates product discovery, garment galleries, guest shopping, a simulated checkout, bespoke enquiries, and a sample owner dashboard. It is a private prototype: catalogue items, prices, stock, accounts, orders, and business reports are illustrative and are not connected to live shop operations.

## Boutique profile

Public business and bridal-vendor listings describe Attraqtive Label as a designer couture and occasionwear boutique in Ram Nagar, Visakhapatnam. The profiles reference bridal and wedding attire, designer gowns, custom outfits, tailoring, and occasionwear. They also describe customization and made-to-order work. These are third-party descriptions, not a current catalogue or confirmation that every service is available today. See the [WedMeGood vendor profile](https://www.wedmegood.com/profile/Attraqtive-Label-1294980) and [Justdial listing](https://www.justdial.com/Visakhapatnam/Attraqtive-Label-Opposite-Icici-Bank-Ramnagar-Branch-Ram-Nagar/0891PX891-X891-200218182958-M8Q9_BZDET).

| Detail | Information |
| --- | --- |
| Boutique | Attraqtive Label |
| Location | Ram Nagar, Visakhapatnam, Andhra Pradesh, India |
| Publicly listed address | SF-2, 10-29-10/13, Waltair Main Road, opposite ICICI Bank (Ramnagar Branch), Ram Nagar, Visakhapatnam, Andhra Pradesh 530002. Confirm with the boutique before publication. |
| Phone | +91 90599 98264; supplied for the project and also present in public listings. |
| WhatsApp, email, hours, social accounts | Not confirmed by the owner. Do not present candidate listings as official contact channels. |

Public listings disagree on some business details, including hours and pricing. The address and product/service descriptions above are included as research notes for this private project and require owner confirmation before they are published as official shop information. The project does not claim a verified establishment year, founder biography, live price list, or current inventory.

## Demo features

| Area | Demonstration |
| --- | --- |
| Storefront | Editorial homepage, collection discovery, atelier story, selected styles, new arrivals, and consultation entry point. |
| Catalogue | Nine illustrative styles across four proposed categories, with search, sorting, filters, and quick view. Categories and sample assortment are configurable proposals, not confirmed live inventory. |
| Product pages | Product View, On Model, and Details imagery on every sample product; image enlargement and 2× zoom. The Garnet Zardozi Lehenga includes two model views. |
| Shopping | Guest-accessible wishlist and bag, variant and quantity selection, and browser-persisted demo state. |
| Checkout | Simulated delivery or boutique-collection flow. No payment is processed and no order is sent to the boutique. |
| Bespoke enquiries | A local consultation form creates a demo reference and an item in the sample owner queue. |
| Customer account | Demo sign-in and receipt history for orders completed in the current browser. |
| Owner dashboard | Sample sales trends, style and variant demand, stock, orders, refunds, enquiries, follow-ups, and CSV export. |
| Concept previews | Preset-based Find Your Inspiration and Virtual Atelier examples. These do not upload or process customer photos. |

### Sample credentials

| Role | Demo email | Demo access code |
| --- | --- | --- |
| Customer | `customer@example.test` | `SHOP2026` |
| Boutique owner | `owner@example.test` | `OWNER2026` |

Enter the email and matching access code in their respective fields. The demo role is stored for the current browser tab. Guests can browse, save styles, add to the bag, and complete the simulated checkout without signing in.

## Run locally

Requirements: Node.js 20.9 or later and npm. Development used Node.js 24 and npm 11.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The demo uses local WebP images, local fonts, typed sample data, and browser storage. It does not require environment variables, credentials, an external API, or a database.

## Try the storefront

1. Browse the homepage and open a collection or product.
2. On a product page, compare Product View, On Model, and Details; enlarge an image to inspect it.
3. Save an item, add a selected size to the bag, and refresh to see browser persistence.
4. Complete a simulated checkout as a guest. Use sample contact information and PIN `530002`, or select boutique collection.
5. Submit a sample bespoke enquiry and inspect its reference in the owner queue.
6. Sign in as the customer to review a demo receipt, or as the boutique owner to explore reports, the order register, stock actions, enquiry follow-ups, and CSV export.
7. Open the concept pages to compare prepared discovery and Virtual Atelier examples.

All product images are illustrative. Catalogue prices and starting stock are fixtures. Owner reports combine seeded sample orders with simulated activity stored in the current browser. The role gate is client-side and credentials are public demo values; it is not suitable for real users or business data. Checkout, refunds, fulfilment, consultation handling, and AI concepts are simulations. The demo stores no payment data and does not send customer submissions to the boutique. Review the asset notes in [`public/images/PROVENANCE.md`](public/images/PROVENANCE.md).

## Design direction

The homepage uses the original editorial arrangement, warm ivory and wine colours, Cormorant Garamond display headings, and Instrument Sans for interface and body text. Catalogue pages retain responsive discovery and category navigation. The design uses broad fashion-retail usability principles without copying reference brands, copy, or assets.

## Build and verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite serves the static build and covers desktop and mobile journeys. To use an existing Microsoft Edge installation, set the channel before running the suite:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm run test:e2e
```

## Private static deployment

The production build exports the site to `out/`. The preview command serves that directory locally:

```sh
npm ci
npm run build
npm run preview
```

For a private host:

1. Configure the host to serve `out/`, resolve directory index files for trailing-slash URLs, and serve the exported `404.html` for missing routes.
2. Enable authenticated, private access at the hosting layer before sharing the preview. The application itself provides only demo authentication.
3. Check direct navigation and refresh on collection and product URLs.
4. Walk through the bag, simulated checkout, and consultation flows on the deployed host.

The app excludes the demo from search indexing through metadata and `robots.txt`; this does not replace host access control. The build also normalizes static navigation segment paths emitted by Next.js for Windows exports. See [Next.js issue 85374](https://github.com/vercel/next.js/issues/85374).

## Replacing demo content

- Update boutique name, location, contact, and approved brand copy in [`src/data/brand.ts`](src/data/brand.ts).
- Replace the sample catalogue, variants, prices, stock, and media references in [`src/data/catalogue.ts`](src/data/catalogue.ts).
- Add optimized, owner-authorized image derivatives to `public/images/`, define their media roles and accurate alt text in the catalogue, and record their origin.
- Replace campaign and editorial images and review mobile crops, product galleries, and no-index metadata.
- Revisit the owner dashboard fixtures and README walkthrough whenever demo behavior changes.

## Owner confirmations before public launch

- Approve the official wordmark, brand colours, copy, story, and any public-facing boutique details.
- Confirm the address, hours, phone, WhatsApp availability, email, and social profiles.
- Confirm current collections, made-to-order and ready-to-wear availability, variants, prices, stock, lead times, and fitting or consultation process.
- Provide rights-cleared product, model, and detail photography, plus consent for any customer images or testimonials.
- Approve shipping, collection, tax, invoicing, payment, returns, privacy, and customer-support procedures.
- Define the production scope before integrating real accounts, orders, payments, inventory, or customer enquiries.

## Production roadmap

1. Add staff catalogue, inventory, media, and content management with server-enforced roles, audit records, and reviewed database migrations.
2. Add optional customer accounts, secure guest sessions, server-side carts, wishlist reconciliation, and consultation intake with monitoring and retention controls.
3. Implement authoritative checkout totals, transactional stock reservations, verified and idempotent payment events, shipping, order management, refunds, and notifications. Validate in a provider sandbox before any live launch.
4. Evaluate visual search against an approved catalogue, known reference images, retrieval accuracy, indexing needs, and operating costs.
5. Evaluate virtual try-on separately for image quality, latency, cost, consent, privacy, storage, deletion behavior, output bias, and fit disclosures before a controlled pilot.

## Project references

- [Project overview](Six-File+Context+Methodology/templates/context/project-overview.md)
- [Architecture and data model](Six-File+Context+Methodology/templates/context/architecture.md)
- [UI context](Six-File+Context+Methodology/templates/context/ui-context.md)
- [Progress tracker](Six-File+Context+Methodology/templates/context/progress-tracker.md)
- [Illustrative image provenance](public/images/PROVENANCE.md)
- [Boutique research notes](Company%20info/Attraqtive_Label_Details.md)
