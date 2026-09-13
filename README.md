# Poštarka

Implementation of the "Poštarka — Ceo sajt" design (see `../README.md`, `../chats/`, and
`../project/Poštarka - Ceo sajt.dc.html` for the original Claude Design handoff). Built with
Next.js (App Router), Prisma + SQLite, and Tailwind CSS.

All copy, prices, brand name, and contact details are placeholders carried over from the
design mockup — swap them for the real business details whenever they're ready.

## Getting started

```bash
npm install
npm run dev
```

The app reads `.env` for configuration (see `.env.example`). On first run:

```bash
npx prisma db push   # create/sync the SQLite schema
npx prisma db seed    # load the 13 postcards + 2 Postcrossing packages from the design
```

## Pages

- `/` — home
- `/katalog`, `/katalog/[slug]` — catalog with filters, and individual postcard/package pages
- `/korpa` — cart (client-side, persisted to `localStorage`)
- `/naplata` — checkout; creates a real `Order` in the database and decrements stock
- `/o-meni`, `/dnevnik`, `/kontakt` — about, blog, contact (contact form stores messages in the DB)
- `/admin` — password-gated product management (add/adjust stock/cycle status/delete)
- `/admin/porudzbine` — order list with status updates

## Admin login

Default password is `postarka2026` (see `ADMIN_PASSWORD` in `.env`). Change it before any
real deployment, along with `ADMIN_SESSION_SECRET`.

## Checkout payment rules

Implemented per the design chat: bank transfer ("uplatnica") is always available domestically;
cash-on-delivery ("pouzećem") is Serbia-only and capped at 5 postcards per order (packages count
their card total, e.g. a package of 10 counts as 10); international orders always prepay via
PayPal/Wise/IBAN. An Instagram-DM ordering option is offered everywhere as an alternative.
