# Popular layouts only for Bookshelf + correct production data on Corner / U orders

## 1. "Or start from a popular layout"
Show the popular-layouts block on Step 1 only when **Bookshelf** is selected. Hidden for Corner, Cathedral, U-Surround and Rack.

## 2. Production data on the Shopify order (confirmed bug)
What the order receives today, for every type:
- Width, Total Height, Number of Shelves, one line per shelf, Finish, email, images.

What is missing:
- **Corner:** the second arm (its width and its shelves) is sent by the configurator but the order ignores it — so the order shows only one side. Inside/outside variant is not sent at all.
- **U-Surround:** the left / back / right widths are never sent; the order shows a single width and one set of shelves, as if it were a straight bookshelf.
- The product type itself (Corner, U-Surround, Cathedral…) is not written on the order.

Fix — every order will carry:
- **Type** (Bookshelf, Corner inside/outside, U-Surround, Cathedral, Rack).
- **Corner:** "Arm 1 width", "Arm 1 Shelf 1…n", "Arm 2 width", "Arm 2 Shelf 1…n", total shelves = both arms.
- **U-Surround:** "Left width", "Back width", "Right width", plus the shelf list (same shelves on all three walls) and number of sides.
- **Cathedral:** width, low height, high height, direction.
- Order note and title include the type and all widths.
- Price stays exactly as today (it was already correct).

## 3. Verification
- Tests: one per type checking the order lines (corner shows both arms; U shows three widths; type always present); one test that popular layouts appear only for Bookshelf.
- Real checkout on the live site for a Corner and a U-Surround with coupon, open the draft order in Shopify, confirm every line, then delete the test orders (no payment).

## Technical notes
- `BookshelfConfigurator.tsx`: gate `data-testid="presets"` on `mainType === "bookshelf"`; checkout `config` adds `mainType`, `cornerVariant`, `uSurround {w1,w,w2}`, `cathedral {...}`.
- `src/routes/api/pbs-create-checkout.ts`: build properties per type, read `shelves2` / `width2` / `uSurround`; `shelvesCount` sums both arms for corner.
- Funnel step names and pricing logic unchanged.
