# Quote email with design, size and price

## Step 1 — Sender domain (you)
Set up the sender domain (e.g. notify.perfectbookshelf.com) in the email setup dialog. Emails start sending once the domain is verified.

## Step 2 — What gets sent
- One "Your Perfect Bookshelf quote" email, sent right after a shopper enters their email at the quote step (the wizard already promises "your quote will arrive in your inbox").
- Contents: 3D preview image, layout, size line (e.g. 69¾″ W × 59¾″ H · 4 shelves), wood, price, 5-year warranty, and a "Continue my design" button back to the designer.
- One email per saved quote; not sent again for the same design.
- Repeated "you forgot your quote" reminders are not included: those count as marketing and would hurt delivery of all store emails. They belong in Shopify Email/Klaviyo, which already have these subscribed customers.

## Technical details
- Run email infrastructure setup, scaffold app emails, add `quote-saved` template in brand style.
- Send from the existing lead-capture server route after saving the quote lead, via the internal send path; idempotency key from lead id + config hash.
- Branded unsubscribe page at the path the scaffold reports.
- Test: save one quote, confirm a sent entry in the email log, then delete the test lead.
