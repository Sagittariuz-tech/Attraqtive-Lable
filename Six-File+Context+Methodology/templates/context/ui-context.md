# UI Context

## Theme

Quiet luxury inspired by Indian occasionwear editorials. Use an ivory canvas, wine-toned imagery, a typographic wordmark, clipped composition and generous spacing. References include [COS runway presentation](https://www.cos.com/en-eu-e/runway/spring-summer-2026) and [Aza wedding discovery](https://www.azafashions.com/wedding).

## Colors

| Role | Token | Value |
| --- | --- | --- |
| Page | `--paper` | #F7F3EC |
| Surface | `--parchment` | #EEE8DF |
| Main text | `--ink` | #24211F |
| Muted text | `--muted` | #6C5D54 |
| Accent | `--wine` | #471F29 |
| Decorative accent | `--champagne` | #D8C7A8 |
| Hairline | `--line` | #D8CEC2 |

## Typography

Cormorant Garamond or a locally available editorial serif for display and Instrument Sans or Geist for interface text. Use licensed local fonts and robust fallbacks. Use sentence case for prose and tracked uppercase in compact navigation and functional labels.

## Border Radius

Rectangular image crops and buttons, with rounded swatches and small circular icon actions. Use outlined, contrast-tested focus indicators.

## Component Library

Use native semantic controls or Radix primitives where needed for focus containment, Escape handling and status feedback. Icons use Lucide with accessible names for icon buttons. Galleries distinguish on-model, product and detail imagery and use swipe, keyboard and fullscreen controls.

## Layout Patterns

- Announcement, navigation, cinematic hero, collection edits, featured samples, atelier story, bespoke journey, lookbook and private consultation.
- Desktop gallery and sticky product details. Mobile uses swipe gallery and thumb-friendly controls. In the enlarged garment view, a 2× zoom exposes a scrollable image region. Arrow keys browse the main gallery and Escape closes the enlarged view.
- On scroll use transform and opacity reveals with GSAP lifecycle cleanup and a reduced-motion guard. CSS owns hover and focus transitions. Reserve media dimensions and lazy-load secondary imagery.

## Reference review

- Use garment perspectives and outfit context to support purchase decisions. [H&M dresses](https://www2.hm.com/en_in/women/shop-by-product/dresses.html)
- Give the campaign image room to establish the visual tone. [Zara Studio editorial](https://www.zara.com/integration/pressapi/multimedia/be/40/d8c51b4048aa8a99d6415f647ac8_original.pdf)
- Let the collection structure and typography support the editorial rather than overwhelm it. [COS runway](https://www.cos.com/en-eu-e/runway/spring-summer-2026)
- Organize bridal stories around distinct perspectives. [Sabyasachi](https://sabyasachi.com/)
- Offer occasion-led entry points for Indian designerwear. [Aza wedding edit](https://www.azafashions.com/wedding)
- Keep discovery filters separate from the product imagery and headings. [Farfetch womenswear](https://www.farfetch.com/shopping/women/clothing-1/items.aspx)
