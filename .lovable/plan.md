# Remove the sticky scroll effect (desktop and mobile)

## Why it still happens (found in the code)
1. **Desktop:** the 3D preview is forced to full screen height and pinned with `lg:sticky lg:top-0 lg:h-screen`, so it stays still while the options scroll past.
2. **Pinned header in the right panel:** the selection/price bar and step progress sit above an inner box with its own scrollbar (`overflow-y-auto`). Only that box scrolls, so the top of the panel looks stuck. This happens on desktop and tablet.
3. **Tablet gap (769–1023px):** the mobile fix in `styles.css` only applies up to 768px, but the desktop layout starts at 1024px. In between, the inner scroll box is still active.
4. **Mobile "stuck" feeling:** the preview area blocks touch scrolling (`touch-action: none`), so swiping on the 3D can't move the page, and it feels pinned.
5. **Inside the Shopify page:** if the iframe on the store has a fixed height, the app scrolls inside the frame instead of the page, which also feels sticky. Checked after the code fix.

## Changes
- **WizardShell.tsx**
  - Preview: remove `lg:sticky lg:top-0 lg:h-screen`; use a normal fixed height (e.g. `h-[32svh]` mobile, `lg:h-[80vh]` desktop) that scrolls away with the page.
  - Remove `overflow-y-auto` from the step body and `min-h-screen` from the layout, so there is one page scroll only.
  - The selection/price bar becomes plain content (no pinning).
- **styles.css**
  - Make the "no nested scroll" rules apply at every width (not only ≤768px), remove `touch-action: none` from the preview wrapper, and keep it only on the canvas while dragging (pan-y allowed, so a vertical swipe scrolls the page).
- **BookshelfConfigurator.tsx**: remove `lg:min-h-screen` from the preview container.
- **3D controls**: set OrbitControls/canvas so a one-finger vertical swipe scrolls the page; rotating still works with horizontal drag.
- **Shopify iframe**: check the theme iframe; if it has a fixed height, make the app send its height to the page (postMessage) and let the theme resize the iframe, so the store page does the scrolling.

## Checks
- Playwright at 390, 820, 1280 wide: scroll the page and confirm the preview and header move up with the content (position changes), there is only one scroll container, and the 3D still rotates.
- Confirm the Back/Next and checkout buttons still work. Then publish.
