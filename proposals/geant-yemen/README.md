# Géant Yemen proposal page (WordReward)

An interactive proposal for Géant Hypermarket, Aden Mall. It is a single static page (`index.html`), Arabic first with an English toggle (`?lang=en`), and works on phones and desktops.

It is not part of the Quartz garden build: Vercel only publishes `public/`, so this folder is never deployed from here.

## The idea

The page is made to be touched before it is read.

1. **The coin (hero).** It shows the WRD mark on one side and "1M followers" on the other, under the headline "Two sides of one coin". The two sides stand for Géant's two goals, sales and a million-follower page. Dragging flips it, a tap flicks it, and the goal pill below follows whichever side faces up.
2. **The offer cube (one week of Géant).** Each face is a card from their real week: the weekly food cover, a food item card, a non-food magazine page, a cooking-show idea, an educational idea, and the Golden Offer hidden on the back. Finding the gold face unfolds the cube into its net and opens the Wednesday to Wednesday plan. While flat, every design opens full size (tap, then swipe or use the arrows), and "Fold it back into a cube" turns it back into a spinning cube. A "Show the weekly plan" button fades in after about 6 seconds, so a busy reader is never stuck.
3. **The gotcha, right after play.** As soon as the coin settles after two or more flips, a short note appears under it with the reader's own count ("Nobody asked you to flip the coin, yet you flipped it 6 times..."). The cube does the same under the cube, with turns and seconds. Readers who never touch them never see the note.

The cube rotates freely on all three axes with inertia, then settles face-first and upright when it slows down. Dark mode follows the system setting, using the WRD dark palette (navy and amber).

The interaction counts stay in the visitor's browser memory. Nothing is stored or sent anywhere.

## WRD brand (source of truth)

Colours and type follow "WordReward Brand Colors.md" (Drive, locked 2026-04-16): light mode cream `#f7f3eb`, slate `#434459` text, teal `#39b5a8` primary with slate text on it; dark sections navy `#1E1F27` with amber `#ffdb8e`. Arabic: IBM Plex Sans Arabic body, DIN Next LT Arabic / Noto Kufi Arabic display. Latin: Poppins body, Rockwell (Roboto Slab fallback) display. No other accent colours.

The WRD mark is one colour (`#434459`): a solid triangle pointing down above an outlined triangle pointing up. The SVG here is a trace of the WRD Ads dashboard icon; swap in the official vector from `_BRAND_KIT/03_Logo_Vector` when available. The Géant sample cards keep Géant's own fonts (Almarai, Montserrat in place of Gotham).

## Before sending

- [ ] **Samples.** Save the team's six redesigns and the matching originals as `assets/samples/{1A,1B,2A,2B,3A,3B}-after.png` and `...-before.png` (1A food cover, 1B food card, 2A non-food cover, 2B non-food inner page, 3A Golden Offer basket, 3B Golden Offer card). The "Before and after" section stays hidden until at least one `-after.png` exists.
- [ ] **Cube faces (optional).** The cube faces are typographic stand-ins built from the real products, prices and dates in Géant's source PDFs. Once the redesigns are approved, they can be swapped in as images.
- [ ] **Brand kit.** The Géant colours on the cards are approximations (green `#3DAA35`, red `#E2231A`, yellow `#FFE418`). Replace them in `:root` when Islam sends the official kit. The Géant logo is never drawn on the page.
- [x] **Pricing.** $2,000 a month, all inclusive (set in `PRICING` at the top of the script). Ad budget is paid by Géant directly to the platforms.
- [ ] **Term.** Payment and term follow the WRD retainer standard used in the El Ryada proposal (monthly in advance, 6 months, 30 days notice after). Confirm for Géant.
- [ ] **Decision maker's name.** "Mr. Matar" is still unconfirmed, so the page doesn't name him.
- [ ] **Hosting.** Same pattern as `morita.wordreward.net`: upload the folder as is behind the password gate. The page already carries `noindex`.

## Files

- `index.html`: the whole page (CSS and JS inline, fonts from Google Fonts: IBM Plex Sans Arabic, Noto Kufi Arabic, Poppins, Roboto Slab, plus Almarai and Montserrat for the Géant cards).
- `assets/og.png`: link preview (1200 × 630), the coin caught mid-spin. Regenerate it from `index.html?still=-38`, a frozen frame.
- `assets/favicon.svg`: the WRD mark.
- `assets/samples/`: before and after pairs (see above).
