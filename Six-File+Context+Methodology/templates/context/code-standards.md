# Code Standards

## General

Keep catalogue, price, stock, and cart rules in shared typed code. Keep presentational modules focused. Use stable identifiers and derive values from canonical fixtures.

## TypeScript

Use strict mode, typed props, discriminated domain modes and explicit handling of missing records. Validate form data and persisted state before use. Prefer integer minor units for money.

## Next.js

Server components own route-level composition and static metadata. Client components own local persistence, dialogs, forms, filtering and animation. Build product and collection routes from published fixture slugs.

## Styling

Define semantic tokens and Tailwind v4 theme mappings in `src/app/design-system.css`. Use its container, stack, cluster, rail and responsive grid primitives; keep component-specific rules in `globals.css`. Reserve serif display type for editorial moments. Use mobile-first CSS. Keep content visible before hydration. Provide focus-visible, keyboard and reduced-motion equivalents for animated UI.

## API Routes

Stage B API handlers parse inputs and enforce session, authorization, idempotency and rate limits before calling domain services. Use consistent errors and redact secrets, personal information and provider payloads from logs.

## Data and Storage

Maintain deterministic fixture data and media provenance. Store only cart and saved identifiers locally. Keep private assets in access-controlled object storage. Establish backups and retention before production.

## File Organization

- `src/app` routes, metadata and global layers.
- `src/components` storefront components.
- `src/data` brand configuration and sample catalogue.
- `src/lib` domain logic, client state and validation.
- `tests` fixtures and verification flows.
