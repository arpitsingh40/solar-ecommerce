# SolarStore India

A dealer-only, India-first rooftop solar kit storefront built with Next.js. SolarStore sells ten complete 1–50 kW kits — never loose panels, inverters, batteries or components — with INR pricing, GST invoices, UP subsidy guidance, Indian address validation, UPI/NEFT payment and role-based dashboards. Every kit is priced at 65% of the typical homeowner turnkey quote, leaving 35% with the dealer for installation, labour and profit.

The interface follows a restrained Apple-inspired design system and is deliberately locked to light mode.

## What is included

### Storefront
- Ten-SKU dealer catalogue: LK-01 to LK-10 across On-Grid, Hybrid and Commercial kit families
- Turnkey homeowner price, 65% dealer kit price and 35% dealer margin shown on every card and product page
- Category, price and search filtering with pagination
- Kit detail pages with local installation photography, fullscreen preview, specifications, delivery check, UP subsidy benchmark and related kits
- Dealer kit order, saved kits, launch credit support and persistent local state
- Four-step B2B checkout with address, pincode, mobile number, mandatory GSTIN, optional PO reference and UPI/NEFT payment
- Order confirmation with GST breakdown, freight, dealer credit and printable invoice view
- Search, contact, support, FAQs, shipping, returns, warranty, privacy and other policy pages
- Six original solar guides in the learning centre

### India-specific tools
- Dealer quote calculator with state-level yield and tariff assumptions, homeowner turnkey cost, UP subsidy, dealer kit price, dealer margin, payback and CO₂ estimates
- Project builder with on-grid, hybrid and commercial kit presets
- Catalogue and prices in Indian numbering format (lakh/crore)

### Accounts and dashboards
- Custom authentication using scrypt password hashes and signed HS256 session tokens in an httpOnly cookie
- Dealer dashboard with kit orders, margin metrics, saved kits, local address book, account settings and order history
- Admin dashboard for kits, orders, dealers, inventory, analytics and store settings
- Supplier dashboard for kit SKUs, orders, inventory, payouts, performance and settings
- Role-based route protection for dealer, admin and supplier areas

### Design
- Apple-inspired palette: blue `#0071E3`, near-black `#1D1D1F`, muted `#6E6E73`, white and `#F5F5F7`
- Forced light mode regardless of the operating-system preference
- Responsive storefront and mobile navigation for all three dashboards
- Locally hosted imagery under `public/images/solar/`

## India commerce rules

- All dealer kit prices are in INR and include 5% GST.
- Freight is included on every kit; kits dispatch from Lucknow.
- Cash on delivery is not offered; dealer orders are prepaid by UPI, card, net banking or NEFT/RTGS.
- Returns are accepted within 7 days on unopened kits.
- PM Surya Ghar central assistance is estimated at ₹30,000 for 1 kW, ₹60,000 for 2 kW and ₹78,000 for 3 kW or more. Uttar Pradesh adds a ₹30,000 state top-up, for a combined ₹1.08 lakh benchmark at 3 kW.
- The 3 kW kit has a ₹1.12 lakh dealer price and ₹1.72 lakh homeowner turnkey price; after the combined UP subsidy the homeowner net is about ₹64,000 and the dealer retains ₹60,000.
- Checkout supports UPI, cards, net banking and NEFT/RTGS, with mandatory GSTIN capture and an optional purchase-order reference.

Payments are simulated for this demonstration. No card number, CVV, bank password or UPI PIN is collected or stored.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS 4, Radix UI primitives |
| Auth | Custom scrypt + HS256 JWT, httpOnly cookie |
| State | Zustand and localStorage for kit order, saved kits, orders and addresses |
| Data | Local TypeScript catalogue and JSON stores under `.data/` |
| Tests | Vitest |
| Icons | Lucide |

## Run locally

Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

For a production check:

```bash
npm run build
npm run start
```

### Environment variables

Copy `.env.example` to `.env.local` and set a strong secret:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="SolarStore India"
AUTH_SECRET="replace-with-a-long-random-secret"
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

`AUTH_SECRET` signs the seven-day session cookie. Use HTTPS in production so the `Secure` cookie flag is honoured by deployment infrastructure.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Dealer | `customer@solarstore.com` | `customer123` |
| Admin | `admin@solarstore.com` | `admin123` |
| Supplier | `supplier@solarstore.com` | `supplier123` |

New dealer sign-ups require a business name and are stored with the internal `customer` role. Admin and supplier accounts are seeded for demonstration.

## Routes

| Area | Routes |
| --- | --- |
| Storefront | `/`, `/products`, `/products/[slug]`, `/dealers`, `/cart`, `/checkout`, `/wishlist` |
| India tools | `/solar-calculator`, `/project-builder` |
| Content | `/learn`, `/learn/[slug]`, `/support`, `/contact`, `/faqs`, `/shipping`, `/returns`, `/warranty`, `/about` |
| Authentication | `/auth/signin`, `/auth/signup` |
| Dealer | `/dashboard`, `/dashboard/orders`, `/dashboard/addresses`, `/dashboard/settings` |
| Admin | `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/inventory`, `/admin/analytics`, `/admin/settings` |
| Supplier | `/supplier/dashboard`, `/supplier/products`, `/supplier/orders`, `/supplier/inventory`, `/supplier/payouts`, `/supplier/performance`, `/supplier/settings` |

## Persistence

This project is self-contained and does not require a database for the demo:

- User accounts and password hashes: `.data/users.json`
- Contact enquiries: `.data/messages.json`
- Newsletter subscriptions: `.data/newsletter.json`
- Kit order, saved kits, placed orders and saved addresses: browser localStorage

The JSON files are demo persistence. For a multi-instance production deployment, replace them with a transactional database and connect a real payment gateway and email provider.

## Verification

```bash
npm run type-check
npm test
npm run build
```

The project has also been exercised end-to-end in a production build: dealer signup, sign-in, role gating, calculator-to-order, GSTIN checkout with NEFT, order confirmation, order history, newsletter and contact submission, and mobile dashboard navigation.

## Project structure

```text
src/
├── app/
│   ├── (public)/          Storefront, tools and content
│   ├── admin/             Admin dashboard and dynamic sections
│   ├── supplier/          Supplier dashboard and dynamic sections
│   ├── dashboard/         Dealer account area
│   ├── api/               Auth, search, contact and newsletter endpoints
│   └── auth/              Sign-in and sign-up
├── components/
│   ├── forms/             Contact and storefront forms
│   ├── layout/            Header, footer, sidebar and dashboard shell
│   ├── product/           Product cards and gallery
│   └── ui/                Design-system primitives
├── lib/
│   ├── auth/              scrypt user store and session signing
│   ├── data/              Indian catalogue and editorial content
│   ├── commerce.ts        Kit order totals, freight and dealer credit logic
│   ├── india.ts           GST, subsidy, state and validation helpers
│   └── orders.ts          Local order persistence
└── proxy.ts               Route protection and role gating
```

## Security notes

- Passwords are stored as salted scrypt hashes, never plain text.
- Session tokens are signed JWTs delivered in an httpOnly, same-site cookie.
- Role checks happen in `src/proxy.ts` and again in protected dashboard layouts.
- Checkout never collects raw card, bank, UPI or NEFT credentials.
- `.data/`, `.env.local` and build output are excluded from source control.
