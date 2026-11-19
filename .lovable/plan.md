# "Talk to us" on the preview step

## What changes
- A **Talk to us** button sits next to Checkout on the preview step. It is quieter than Checkout, so paying stays the main choice.
- Clicking it opens a short message form over the designer with these fields: name, email (filled in from the quote), phone (optional) and message. A note under it says "We'll see your exact design." Your current design, size, wood and price are sent along automatically.
- The customer sees a confirmation and keeps their design open, so they can still check out.
- If you prefer, the button can open your existing "Book a consultation" page instead. That's the question above, and the form is the default until you answer.

## Where messages go
- Each message is saved in the backend with the design attached. You can see it in the backend under the "design messages" list.
- Email alerts to you only work once a sending domain is verified. I'll check that during the build. If it isn't ready, I'll tell you the one step it needs and won't fake it.
- Each click and each sent message is counted in the funnel, so next week's report shows whether it helps.

## Other ideas to raise conversion (not part of this build)
1. Show a price range before the email box, or ask for the email later. This targets the 122 visits that left at the email box.
2. Put delivery time, "free changes for 24 hours" and the return note next to the price.
3. Send an email to people who gave their email but didn't check out, with their saved design and price.
4. Add a small deposit option ("reserve your build") next to paying in full.
5. Show reviews and a few real installed photos on the preview step.
6. Add a "Save / share my design" link to send to a partner.

## Technical details
- New table `design_messages` (created_at, name, email, phone, message, config jsonb, price, render_url). RLS on with no public reads. Inserts go through a validated (zod) server route under `/api/public/`.
- New sheet component reusing the QuoteEmailSheet style. New tracking events `talk_to_us_click` and `talk_to_us_sent` added to FUNNEL_EVENTS.
- Owner email via the app email setup only if `check_email_domain_status` is verified. Test: one submission, confirm the row, delete it by id.
