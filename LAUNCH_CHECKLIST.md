# Udaan Coaching Launch Checklist

## Ready
- Public pages load: Home, Courses, Study Material, Mock Test, Contact, Sign Up, Login, Payment, Privacy, Terms.
- Local link audit passes for public pages.
- SEO descriptions are present on public pages.
- Admin, student dashboard, and faculty dashboard are marked `noindex`.
- `robots.txt`, `sitemap.xml`, favicon, and web manifest are included.
- Mock test opens without blocking overlay and supports course selection, answer selection, next question, and submission.
- Contact form opens a WhatsApp enquiry with the visitor's message.
- Empty footer links have been replaced or routed.

## Confirm Before Public Launch
- Final domain name. Current sitemap assumes `https://udaancoaching.com/`.
- Official YouTube URL, if you want YouTube shown in the footer.
- Official Instagram URL. Current footer uses `https://instagram.com/rgajraj1`.
- Official WhatsApp admission number. Current number is `+91 96801 41133` in WhatsApp links.
- Official public phone number. Current displayed number is `+91 99502 32074`.
- Official email address. Current email is `info@udaancoaching.com`.
- Payment mode: current launch flow uses secure UPI submission to `9680141133-2@ybl` with admin verification. For instant automatic confirmation, connect a payment gateway and backend webhook.
- Managing Director photo. Current page uses an external illustration placeholder.

## Deployment Notes
- Upload the contents of `coaching-lms/` to the hosting root.
- Keep `index.html`, `robots.txt`, `sitemap.xml`, and `site.webmanifest` at the root.
- After upload, test these URLs:
  - `/`
  - `/courses.html`
  - `/mock-test.html`
  - `/contact.html`
  - `/signup.html`
  - `/payment.html`
- Submit `/sitemap.xml` in Google Search Console after the final domain is live.
