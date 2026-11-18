# UI Context

## Design direction

The storefront uses an ivory canvas, parchment surfaces, ink text and wine accents. Cormorant Garamond gives headings their editorial character, with Instrument Sans for body copy and interface labels. The homepage opens with the original campaign copy, followed by collections, the atelier story, selected styles, new arrivals and consultation.

The shared palette and fonts are defined in `src/app/design-system.css`. Homepage spacing and the original hero treatment live in `src/app/globals.css`.

The wide hero image is anchored at the top so the model's face stays in frame when the image is cropped on laptops. Phones use a separate image and crop.

## Reference review for the later design refresh, 16 November 2026

Reviewed the live H&M India, Nykaa Fashion and The Souled Store homepages through web text and browser screenshots. These are qualitative observations, not extracted brand font specifications or exact spacing measurements. Cookie and notification overlays limited some views. The Souled Store was also inspected at a 390px viewport; Nykaa exposed its compact navigation in the available pane. A complete mobile product-page audit of all three was not performed.

| Reference | Observed principles | Application in that version |
| --- | --- | --- |
| [H&M India](https://www2.hm.com/en_in/index.html) | Compact sans-serif navigation, high-contrast black shell in the current campaign, large edge-to-edge photography, flat rectangular controls and fine dividers | Clear type hierarchy, image-led campaign, rectangular controls, no decorative card shadows |
| [Nykaa Fashion](https://www.nykaafashion.com/) | Prominent search, visual category strip, closely spaced image tiles, bold section labels, white/light-neutral surfaces; compact menu and shopping icons | Scrollable category rail, compact product metadata, neutral canvas and stronger discovery hierarchy |
| [The Souled Store](https://www.thesouledstore.com/) | Bold department navigation, white header, prominent search, large campaign images, restrained borders and a concentrated red accent; mobile switches to a menu, icons and tall campaign crop | Clear navigation hierarchy, restrained wine accent, dedicated mobile campaign image, visible account and bag actions |

No reference copy, logos, fonts, photos or other assets were imported. Campaign colours change and are not universal brand specifications.

## Responsive primitives

`wrap`, `narrow`, `section`, `stack`, `cluster`, `rail` and `responsive-grid` provide reusable composition. Tailwind exposes semantic colour, font, spacing and type tokens such as `bg-canvas`, `text-accent`, `font-display` and `px-gutter`.

- Catalogue uses four columns from 1100px, three from 701px, two on phones, and one below 360px for readable names and prices. Homepage curated groups retain three-column desktop layouts.
- Product and category crops on the homepage use the earlier portrait proportions. Interior product cards use 3:4 crops. Every sample product page offers Product View, On Model and Details with garment-specific imagery. Gallery images use a contained layout so the whole photograph remains inspectable. Hover changes are supplementary; touch shoppers retain quick view and gallery controls.
- The homepage uses the original single navigation row. Interior pages show a horizontally scrollable category rail below the header. The main menu collapses on narrower screens; account and bag remain accessible. Current category is marked with `aria-current` and an underline.
- Forms keep 16px input text. Product details and checkout stack on mobile. Owner tables scroll within their own container.

## Interaction and truthfulness

Lenis shares GSAP's clock for wheel scrolling and pauses while Radix dialogs lock the body. Touch scrolling stays native. Reduced-motion preferences disable smooth scrolling and editorial entrance animations. Explicit Home links appear in interior desktop navigation, the category rail and the mobile menu. Hero text enters in complete blocks, with top-anchored image motion.

Keep public browsing and guest checkout open. Optional sign-in, demo receipts, stock, refunds, enquiry queues and paired-media concepts retain their existing behavior. Sample imagery, prices and simulated flows remain labeled. Use Radix overlays, semantic controls, keyboard access, focus restoration and reduced-motion support. No new blocking popups.
