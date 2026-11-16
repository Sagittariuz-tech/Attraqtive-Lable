# UI Context

## Design direction

A fashion storefront with a white canvas, near-black interface, restrained wine accents and garment-led merchandising. Instrument Sans handles navigation, product names, prices, forms and dashboard data. Cormorant Garamond remains in the wordmark, campaign heading and atelier story. Retain original Attraqtive branding and locally licensed fonts.

## Reference review, 16 November 2026

Reviewed the live H&M India, Nykaa Fashion and The Souled Store homepages through web text and browser screenshots. These are qualitative observations, not extracted brand font specifications or exact spacing measurements. Cookie and notification overlays limited some views. The Souled Store was also inspected at a 390px viewport; Nykaa exposed its compact navigation in the available pane. A complete mobile product-page audit of all three was not performed.

| Reference | Observed principles | Attraqtive application |
| --- | --- | --- |
| [H&M India](https://www2.hm.com/en_in/index.html) | Compact sans-serif navigation, high-contrast black shell in the current campaign, large edge-to-edge photography, flat rectangular controls and fine dividers | Clear type hierarchy, image-led campaign, rectangular controls, no decorative card shadows |
| [Nykaa Fashion](https://www.nykaafashion.com/) | Prominent search, visual category strip, closely spaced image tiles, bold section labels, white/light-neutral surfaces; compact menu and shopping icons | Scrollable category rail, compact product metadata, neutral canvas and stronger discovery hierarchy |
| [The Souled Store](https://www.thesouledstore.com/) | Bold department navigation, white header, prominent search, large campaign images, restrained borders and a concentrated red accent; mobile switches to a menu, icons and tall campaign crop | Clear navigation hierarchy, restrained wine accent, dedicated mobile campaign image, visible account and bag actions |

No reference copy, logos, fonts, photos or other assets were imported. Campaign colours change and are not universal brand specifications.

## Global tokens

`src/app/design-system.css` is imported by `globals.css`. Tailwind v4 uses CSS-first `@theme inline`; no separate Tailwind config is required.

- Canvas `#FFFFFF`, surface `#F4F3F1`, text `#202020`, muted text `#62605E`, wine accent `#592936`.
- Decorative dividers `#DEDBD7`; input and selection boundaries `#827C76`; error `#A32935`.
- Spacing scale 4, 8, 12, 16, 24, 32, 48 and 64px. Fluid page gutters 16–48px. Main container caps at 1440px and reading container at 760px. Section padding scales from 40–72px.
- Body 16px/1.5, product names 15px/1.4, UI controls 14px, section headings 24–36px. Large display serif is reserved for editorial moments.
- Primary buttons use ink, with wine hover, 48px minimum height, square corners and sentence-case labels. Secondary buttons use an outline. Links use an underline or a visible border response. Focus indicators and reduced-motion handling remain global.

## Responsive primitives

`wrap`, `narrow`, `section`, `stack`, `cluster`, `rail` and `responsive-grid` provide reusable composition. Tailwind exposes semantic colour, font, spacing and type tokens such as `bg-canvas`, `text-accent`, `font-display` and `px-gutter`.

- Catalogue uses four columns from 1100px, three from 701px, two on phones, and one below 360px for readable names and prices. Homepage curated groups retain three-column desktop layouts.
- Product/category crops are 3:4. Every sample product page offers Product View, On Model and Details with garment-specific imagery. Gallery images use a contained layout so the whole photograph remains inspectable. Hover changes are supplementary; touch shoppers retain quick view and gallery controls.
- A horizontally scrollable category rail sits below the header. The main menu collapses on narrower screens; account and bag remain accessible. Current category is marked with `aria-current` and an underline.
- Forms keep 16px input text. Product details and checkout stack on mobile. Owner tables scroll within their own container.

## Interaction and truthfulness

Keep public browsing and guest checkout open. Optional sign-in, demo receipts, stock, refunds, enquiry queues and paired-media concepts retain their existing behavior. Sample imagery, prices and simulated flows remain labeled. Use Radix overlays, semantic controls, keyboard access, focus restoration and reduced-motion support. No new blocking popups.
