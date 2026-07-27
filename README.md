# AFStore

**Live at [afwholesales.com](https://afwholesales.com)**

A self-serve B2B wholesale ordering portal for AdamsFoods, replacing manual phone and email order intake. Verified restaurant and food-business customers browse the catalog, place orders, and track shipping addresses and order history from one account.

Access is gated on business verification — customers upload a business license and California resale certificate at signup, which staff review before the account is approved.

## Stack

- **Frontend**: React 18 + Vite, Chakra UI
- **Backend**: Node.js + Express 5
- **Database**: PostgreSQL (`pg`)
- **Auth**: JWT + bcrypt
- **File storage**: AWS S3 (signup verification documents)
- **Email**: Nodemailer
- **Hosting**: Vercel

## Project Structure

```
client/           # React frontend (Vite) — deployed as the Vercel static build
server/           # Express API
server/routes/    # REST endpoints: users, items, carts, orders, points, s3, inquiries
server/schemas/   # SQL table definitions
server/db/        # Postgres connection pool
```

## Status

Shipped to production and used by restaurant clients. Currently paused due to internal operational changes at the company.

## Running Locally

The client and server are separate npm projects — install and run each one.

```bash
# Frontend (http://localhost:5173)
cd client
npm install
npm run dev

# API server
cd server
npm install
npm run dev
```

The server reads its Postgres connection, JWT secret, AWS credentials, and SMTP settings from `server/.env`.
