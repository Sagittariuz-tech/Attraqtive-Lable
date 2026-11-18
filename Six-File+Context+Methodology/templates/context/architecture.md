# Architecture Context

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Web | Next.js App Router, React, strict TypeScript | Static storefront routes and client interaction islands |
| UI | Tailwind utilities, CSS tokens, Lucide, Radix or native accessible primitives | Responsive components and overlays |
| Motion | Lenis, GSAP and ScrollTrigger, CSS transitions, Embla | Smooth wheel scrolling, editorial entrances, swipe galleries |
| State | Zustand browser persistence, React Hook Form and Zod | Guest bag and wishlist, local form validation |
| Stage B | Next.js route handlers, PostgreSQL, Prisma, Auth.js or equivalent, private object storage | Catalogue, sales, identity, administrative operations |
| Stage C | Replaceable inference and embedding providers, optional queue, optional pgvector | Consent-controlled try-on and catalogue similarity |

Check compatibility at installation and commit a lockfile. Stage A needs no secrets or database. Use a static export for a private demo deployment. Move to a server runtime when Stage B needs sessions, private mutations and webhooks.

## System Boundaries

- `src/app` owns layout, metadata and routes. Home links to collections, search, products, lookbook, atelier, bespoke, contact, account, wishlist, cart, checkout and concept routes. Collection and product slugs are statically generated. Demo robots are closed to indexing. Real canonical, sitemap and product structured data follow approved content and domain.
- `src/components` owns retail shell, editorial presentation, catalogue controls, product gallery, dialogs and forms. Shared cards are used in collections, search, home and wishlist.
- `src/lib` and `src/data` own fixtures, catalogue queries, money, validation and state. Product resolves variants and media. Cart persists variant identifiers and quantities, then resolves current product data for display. Wishlist persists product identifiers, then resolves product cards. Moving a saved product to the bag requires an eligible variant and updates both lists in one state change.
- `public` holds optimized sample imagery and fonts. Sample assets are traceable and replaceable. Media role can be product, model, detail, or video; origin can be authorized or illustrative.
- Stage B layers server-side catalogue, inventory, identity, checkout, order, payment, shipment, notifications and consultation services behind route handlers. Stage C adds upload, consent, private asset and provider adapters. Providers receive scoped inputs and return normalized status and result data.

## Storage Model

### Demo
Typed fixtures contain category, collection, product, media and variants with stable IDs, publication/date fields, garment attributes and retail or consultation mode. Variant contains SKU, colour, size, quantity, optional price, sale price and media override. Money uses integer INR paise. Local browser storage holds cart, wishlist, sample enquiries and demo receipts. Receipts record item snapshots, delivery, payment, fulfilment, refund time and restock state. Each enquiry records structured service and occasion details and a follow-up, stage and reference. Checkout and consultation contact, address and free-text inputs live in memory and reset on navigation or reload.

The owner report builds deterministic sample orders and product-level activity across 180 days. It combines those orders with simulated receipts from the current browser and labels each source. Variant on-hand stock is derived from starting stock and receipts whose units have not been restocked. Checkout revalidates all lines against this stock before writing the receipt. Receipt and enquiry writes use Web Locks where available and refresh persisted state before mutation. Margin and returning-customer estimates use seeded orders.

### Production
- User 1:1 CustomerProfile, 1:N Address, 1:N administrative role assignment. Auth provider owns sessions. Cart and Wishlist can attach to guest session or user. Unique (cartId, variantId) and (wishlistId, productId) pairs.
- Category can reference a parent. Product has unique slug and product SKU, category, collection relationship, descriptions, details, type, attributes, SEO and publication state. ProductVariant has unique SKU and product/options combination. ProductMedia has role, rights, alt text, dimensions, ordering and optional variant reference. Inventory stores on-hand and reserved; quantities are constrained and reconciled transactionally.
- Order has lines with immutable product, quantity, tax, shipping and price snapshots. Explicit order, payment and shipment states are separate. Payment has provider IDs and verified event records with unique idempotency keys. Shipment owns fulfillment/tracking data; Promotion owns eligibility and redemption rules.
- ConsultationRequest and CustomDesignRequest store workflow state and scoped customer contact. UploadedReference links to private object metadata. ContentPage stores publication state and revision. AuditLog records administrative mutations using identifiers and redacted details.
- Stage C adds ProcessingConsent (purpose, notice version, timestamps and withdrawal), TemporaryAsset (owner, expiry, status and storage key), VirtualTryOnJob and VisualSearchRequest (state, provider version, expiry). Catalog embeddings link to media and model version; delete or reindex when publication or model version changes.
- Add foreign keys and indexes for slugs, publish date/category, inventory lookup, owner/status/date and provider references. Ship reviewed migrations through staging and keep encrypted backups with restore checks.

## Auth and Access Model

Stage A leaves browsing, wishlist, bag and simulated checkout open to guests. The header offers demo sign-in and checkout offers optional sign-in for account receipt history. The owner signs in through the same account page and sees a separate owner dashboard. Client checks use a public fixture role in session storage. Stage B supports optional authenticated accounts, scoped guest sessions and server-enforced staff permissions. Roles cover catalogue/content, consultations, fulfillment and administration with auditable access. Sessions use HttpOnly secure cookies, CSRF safeguards as applicable and throttling. Validate request bodies at boundaries and authorize access to each record.

## Invariants

1. Retail checkout accepts priced eligible variants only. Checkout reloads authoritative price, discount, tax, shipping and stock on the server before reserving inventory and creating a pending order.
2. Only provider-verified payment events can advance payment state. Verify signature against raw body, amount/currency and order association, deduplicate events, make state transitions monotonic, and release timed-out reservations. Process refunds and fulfillment independently. Evaluate Razorpay or equivalent at Stage B.
3. Stage A sends no personal data or payments and accepts no photo uploads. Stage C accepts JPEG, PNG and WebP under byte and dimension limits with server-side decoding, short-lived private access, retention/deletion, rate limiting and explicit purpose-specific consent. No training without separate consent.
4. Try-on jobs move through queued, processing, succeeded/failed or deleted. Results are simulations with private comparison and deletion controls. Visual search embeds approved catalogue imagery, ranks and deduplicates similar published products under structured filters, and offers bespoke enquiries when scores are insufficient. Approved processor, latency, inference, storage, indexing, accessibility and quality need evaluation before integration.
5. Run a legal and operational review before production for privacy, Indian e-commerce, consumer protection, invoicing and payments. Use approved policies, secure logging, secret management, accessibility checks and incident monitoring.

## Delivery Sequence

1. Confirm and adapt six context files and plan.
2. Scaffold strict Next.js and establish tokens, images, navigation and motion.
3. Build editorial homepage, discovery and product media/variant journeys.
4. Add wishlist, bag, mock checkout, bespoke and contact flows.
5. Add AI concept screens and private presentation notes.
6. Check unit and browser journeys, responsive and accessibility behavior, build and document deployment.
7. After approval, stage production catalogue and operations, then payments and fulfillment. Evaluate AI only after rights, consent, feasibility, catalogue scale and costs are known.

## Technical References

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

## Proposed production request flow

1. Catalogue reads expose published products and their public media. Staff catalogue changes trigger page revalidation. Index changes asynchronously only if text or visual index infrastructure is approved.
2. Checkout initiation resolves the cart under the active account or guest session, reloads variant data, validates delivery and promotions, then reserves stock and creates an order snapshot. Return the payment-session reference to the browser after the order commits.
3. The payment webhook handler verifies the provider event and uses a unique event ID and transactional update. Fulfillment consumes confirmed order state and queues one confirmation notification per transition. An expired reservation releases stock and surfaces a new checkout attempt to the guest.
4. Consultation submission validates contact and requested purpose, applies rate limits, stores the request with a reference, and opens it to authorized staff for follow-up. An appointment remains requested until staff confirms it.
5. A future AI request records the consent version, allocates a private upload, validates the decoded asset before enqueueing, then returns a job or search-session ID. Status and deletion calls enforce ownership. Expiration workers delete results and source assets and record deletion without retaining the image.

## Release checks by stage

- Stage A requires typecheck, lint, production static build, unit rules, desktop and mobile browser journeys, accessible dialogs and reduced-motion checks. Private hosting should verify redirect rules, direct route access, 404 handling and access control before sharing.
- Stage B requires staging migration and restore checks, least-privilege staff testing, concurrent inventory and checkout tests, signed/replayed/tampered webhook tests, fulfillment and refund drills, verified transactional email and owner acceptance. Use separate sandbox and live credentials. Roll back the application independently of additive database migrations.
- Stage C requires provider and data review, independent quality and latency benchmarks, abuse and upload tests, consent and deletion verification, approved cost ceilings and per-feature rollout controls. Disable the affected feature if the processor or its controls fail.
