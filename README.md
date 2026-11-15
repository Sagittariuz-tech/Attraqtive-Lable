# Attraqtive Label

A private interactive storefront demonstration by Sagittariuz for the Attraqtive Label boutique in Ram Nagar, Visakhapatnam.

## Run locally

Use Node.js 20.9 or newer. Node 24 and npm 11 were used during development.

```sh
npm ci
npm run dev
```

Open [the local storefront](http://localhost:3000). The demo uses local WebP assets and fonts, typed sample data and browser storage. It requires no environment variables, credentials, external APIs or database.

## Build and verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright serves the static build and exercises desktop and mobile paths. To run against an existing Edge installation, set `PLAYWRIGHT_CHANNEL=msedge`. On Windows PowerShell use `$env:PLAYWRIGHT_CHANNEL = "msedge"` before running the test command.

## Private deployment

1. Run `npm ci` and `npm run build` in a clean build environment.
2. Use `npm run preview` to check the generated `out/` directory locally.
3. Configure the chosen static host to serve `out/`, resolve directory index files for trailing-slash URLs and serve the exported `404.html` for missing routes.
4. Enable the host's private, authenticated access control before sharing the demo URL. The app excludes demo pages from search indexing via metadata and robots.txt.
5. After deployment, verify direct navigation and refresh on a collection and product URL. Complete the bag, mock checkout and consultation journeys on the deployed host.

## Client walkthrough

| Included in demo | What to try |
| --- | --- |
| Editorial storefront | Scroll through the homepage, open Bridal Couture and follow a selected creation into the lookbook. |
| Catalogue and product discovery | Filter by size, garment fabric or occasion. Search for “silk” and open a quick view. |
| Model imagery | Open Garnet Zardozi Lehenga and switch between Product View, On Model and Details. Browse the On Model shots, then enlarge one and use 2× zoom. |
| Wishlist and bag | Save the garnet sample, open the wishlist and choose Move to bag. Select M and confirm the move, then open the bag and change the quantity. Reload to verify local persistence. |
| Demo checkout | Enter sample guest information and the sample PIN `530002`. Confirm the simulated order. |
| Bespoke consultation | Preview an appointment request with sample contact data. Open Contact to preview the WhatsApp message. |
| Future AI concept previews | Choose a preset in Find Your Inspiration or compare prepared illustrations in Virtual Atelier. |

The three catalogue items, prices, inventory quantities and media are illustrative. Orders and consultations stay in the demo. The WhatsApp channel is awaiting confirmation, so the interface previews and copies a sample message. Account management is a production concept. Demo AI screens neither upload photos nor run inference.

## Owner review before production

- Approve the wordmark or provide official assets, colour, copy, address, hours and verified contact channels.
- Confirm categories, actual catalogue, variants, sizes, stock, display prices, lead times, custom-order steps and rights-cleared product, model and detail imagery.
- Approve delivery, tax, invoicing, returns, payment, privacy and consultation operations. Confirm the commercial scope of the shop.
- Decide whether the catalogue and usage justify an AI pilot. Approve its security, consent and customer support procedures before testing with personal images.

## Production roadmap

1. Build staff catalogue, inventory, media and content management with secure roles, audit records and staging migrations.
2. Add optional customer accounts, secure guest sessions, server-side carts, wishlist reconciliation and consultation intake. Configure access controls, monitoring and retention before handling customer data.
3. Introduce authoritative checkout totals, transactional inventory reservations, idempotent verified payment events, shipping, orders, refunds and notifications. Verify on a payment-provider sandbox before separating live credentials and opening access.
4. Pilot visual search once the approved catalogue can support useful matches. Measure retrieval accuracy on known garment references, evaluate catalogue indexing and query costs, and set a confidence threshold and bespoke fallback.
5. Pilot virtual try-on separately after evaluating product-image quality, inference latency, per-render cost, storage/egress, processor terms and deletion behavior. Use private short-lived photo storage, consent and result deletion. Review output bias and fit disclosures before launch.

## Context and asset replacement

- [Six-context project overview](Six-File+Context+Methodology/templates/context/project-overview.md)
- [Architecture, data model and delivery sequence](Six-File+Context+Methodology/templates/context/architecture.md)
- [Implementation tracker](Six-File+Context+Methodology/templates/context/progress-tracker.md)
- [Illustrative asset provenance](public/images/PROVENANCE.md)

Edit brand and contact settings in `src/data/brand.ts` and replace the sample catalogue in `src/data/catalogue.ts`. Place optimized derivatives of owner-authorized images in `public/images/`, update the catalogue’s media roles, origin and alt text, and replace the homepage and editorial route imagery. Verify mobile framing, gallery roles and the no-index configuration after changes.
