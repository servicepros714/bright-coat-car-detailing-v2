# Bright Coat Car Detailing Stanton

Mobile car detailing booking site — Vite + React 18, Cloudflare Pages, a Cloudflare Worker with D1, and Stripe PaymentIntents.

| Item | Value |
|---|---|
| Phone | (714) 408-4156 |
| Area | Stanton, CA |
| Hours shown | Mon–Sun by appointment |
| D1 `source` | `brightcoat` |
| Booking ID prefix | `BRCT-` |
| Worker name | `brightcoat-detailing-worker` |
| Pages project | `bright-coat-car-detailing-stanton` |
| Coupon | `PREPAY` = $15 off online payment |

## Services

- **Basic Detail — $150**
- **Premium Detail — $200**
- **Exterior Wash — +$50** (add-on only, booking step 2)

Booking steps: Package → Add-on → Date → Time → Your info → Checkout → Confirmation.
Time slots 7:00 AM – 7:00 PM every 30 minutes, earliest slot 4 hours after current California time.

## 1. Cloudflare Worker (dashboard)

1. Workers & Pages → Create → Worker → name it `brightcoat-detailing-worker` → Deploy.
2. Edit code → paste all of `worker/worker.js` → Deploy.
3. Settings → Bindings → Add → D1 database → variable name `DB` → choose your shared detailing-bookings database.
4. Settings → Variables and Secrets → add Secret `STRIPE_SECRET_KEY` = your `sk_live_...` key.
5. Optional: `ALLOWED_ORIGIN` = your Pages URL, `ADMIN_TOKEN` if your admin dashboard sends a bearer token.
6. Visit `https://brightcoat-detailing-worker.<subdomain>.workers.dev/api/health` — it should return `{"ok":true,...}`.

The table is created/migrated automatically (`worker/schema.sql` is there if you prefer to run it in the D1 console).

## 2. `.env.local`

Replace the two placeholders, then commit (public values only):

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://brightcoat-detailing-worker.<subdomain>.workers.dev
```

## 3. GitHub (Windows CMD)

```
cd C:\Users\ESY\project\bright-coat-car-detailing-stanton
git init
git add .
git commit -m "Bright Coat Car Detailing Stanton site"
git branch -M main
git remote add origin https://github.com/servicepros714/bright-coat-car-detailing-stanton.git
git push -u origin main
```

Create the empty repo on GitHub first. Then in the repo: Settings → Secrets and variables → Actions → add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## 4. Cloudflare Pages

Create a Pages project named `bright-coat-car-detailing-stanton` (Direct Upload, or let the first GitHub Action create it). Every push to `main` builds and deploys through `.github/workflows/deploy.yml`. `public/_redirects` handles SPA routing.

## Local development

```
npm install
npm run dev
```

## Notes

- `payment_status` is saved as `Paid` or `Pay Later`; new bookings start with `status = Pending`.
- The Stripe PaymentIntent ID is stored in `notes`, which also makes paid bookings idempotent (refreshing the confirmation page never duplicates a row).
- `PATCH /api/bookings/:id` accepts `reschedule_date, reschedule_time, original_date, original_time, notes2` plus status fields for the admin dashboard.
- The "Why us" section links to Google for reviews rather than showing sample testimonials — add real customer reviews there when you have them.
