# Bakery Express + Mongoose

This project wraps your existing static front-end into an Express app with Mongoose-backed products and an Admin panel. The original static files remain untouched in the project root.

Quick start:

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.

2. Install dependencies:

```bash
npm install
```

3. Seed sample products (optional):

```bash
npm run seed
```

4. Start the dev server:

```bash
npm run dev
```

Routes of interest:
- `/` - dynamic EJS homepage (static `index.html` still exists)
- `/products` - product listing (EJS), supports `?page=&limit=&category=&minPrice=&maxPrice=` filters
- `/api/products` - JSON API for products
- `/admin` - admin panel for product CRUD

Admin authentication
- The admin routes are protected with HTTP Basic auth. Set environment variables in your `.env`:
	- `ADMIN_USER` (default: `admin`)
	- `ADMIN_PASS` (default: `password`)

Admin URLs
- Admin root: `/admin`
- Product list: `/admin/products`
- Testimonials: `/admin/testimonials`
- Orders: `/admin/orders`

Notes:
- I did not modify any existing files in the workspace; new backend files were added.
- Ensure MongoDB is running and `.env` is configured.
