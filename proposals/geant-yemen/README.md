# Géant Yemen proposal page (WordReward)

An interactive proposal for Géant Hypermarket, Aden Mall. It is a single static page (`index.html`), Arabic first with an English toggle (`?lang=en`), and works on phones and desktops.

It is not part of the Quartz garden build: Vercel only publishes `public/`, so this folder is never deployed from here.

## The idea

The page is made to be touched before it is read.

1. **The coin (hero).** It shows the WRD mark on one side and "1M followers" on the other, under the headline "Two sides of one coin". The two sides stand for Géant's two goals, sales and a million-follower page. Dragging flips it, a tap flicks it, and the goal pill below follows whichever side faces up.
2. **The offer cube (one week of Géant).** Each face is a card from their real week: the weekly food cover, a food item card, a non-food magazine page, a cooking-show idea, an educational idea, and the Golden Offer hidden on the back. Finding the gold face unfolds the cube into its net and opens the Wednesday to Wednesday plan. A "Show the weekly plan" button fades in after about 6 seconds, so a busy reader is never stuck.
3. **The reveal ("What just happened?").** It appears only if the reader actually played: at least 2 coin flips, 2 cube turns, or 1.5 seconds of touching. It quotes their own numbers back to them, then explains that the page was the test: stopping a busy person and making them touch is exactly the job for Géant's posts. Readers who didn't play see a short note asking them to flip the coin first.

The interaction counts stay in the visitor's browser memory. Nothing is stored or sent anywhere.

## Before sending

- [ ] **Samples.** Save the team's six redesigns and the matching originals as `assets/samples/{1A,1B,2A,2B,3A,3B}-after.png` and `...-before.png` (1A food cover, 1B food card, 2A non-food cover, 2B non-food inner page, 3A Golden Offer basket, 3B Golden Offer card). The "Before and after" section stays hidden until at least one `-after.png` exists.
- [ ] **Cube faces (optional).** The cube faces are typographic stand-ins built from the real products, prices and dates in Géant's source PDFs. Once the redesigns are approved, they can be swapped in as images.
- [ ] **Brand kit.** The Géant colours on the cards are approximations (green `#3DAA35`, red `#E2231A`, yellow `#FFE418`). Replace them in `:root` when Islam sends the official kit. The Géant logo is never drawn on the page.
- [ ] **Investment.** The page says the fee is below the current supplier and that figures come in the final version. No amounts are in this repo.
- [ ] **Decision maker's name.** "Mr. Matar" is still unconfirmed, so the page doesn't name him.
- [ ] **Hosting.** Same pattern as `morita.wordreward.net`: upload the folder as is behind the password gate. The page already carries `noindex`.

## Files

- `index.html`: the whole page (CSS and JS inline, fonts from Google Fonts: Almarai and DM Sans).
- `assets/og.png`: link preview (1200 × 630), the coin caught mid-spin. Regenerate it from `index.html?still=-38`, a frozen frame.
- `assets/favicon.svg`: the WRD mark.
- `assets/samples/`: before and after pairs (see above).
