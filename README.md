# TradeNova

TradeNova is a full-stack MERN paper-trading platform: a public marketing site and an authenticated trading
application in one product, backed by a JWT-secured REST API, real market data, and an AI portfolio assistant.
Every account opens with **₹1,00,000 in simulated capital**; every order executes at a real, live market
price fetched server-side — never a price the client supplies — and updates balance, holdings, and portfolio
value the way a real brokerage would, without any real money ever changing hands.

## Problem Statement

Learning to trade by reading about it is different from watching your own balance move after you place an
order. Most "paper trading" demos either use fabricated prices or skip the parts that make trading feel real
— balance validation, average-cost tracking, P&L, order history. TradeNova solves that by pairing a real
market-data feed with a fully worked simulated brokerage backend: the same validation, balance/holding
arithmetic, and portfolio accounting a live trading platform would need, with the downside removed.

## Features

- User registration and login (JWT-based sessions)
- Simulated buy/sell order execution, priced server-side from a live market quote
- Server-side balance and holding-quantity validation (insufficient funds / insufficient holdings rejected)
- Weighted-average cost tracking as a holding is added to
- Portfolio dashboard: available balance, portfolio value, unrealized P&L (₹ and %), allocation breakdown
- Holdings, order history, and a delivery-vs-intraday Positions view
- Funds page (balance / invested value / total account value)
- Markets: symbol search, index quotes (NIFTY 50, SENSEX), a stock-detail page with a historical price chart
- Watchlist with live prices, add/remove, and one-click access to a trade
- AI portfolio assistant (Google Gemini), grounded only in the authenticated user's own account data
- Security controls: password hashing, rate limiting, security headers, CORS allowlist, input validation,
  and per-user authorization enforced on every API route (see [Security](#security))
- Automated backend and frontend test suites, run in CI on every push/PR (see [Testing](#testing))

## Tech Stack

**Frontend**
- React 18 (Create React App)
- React Router v6
- MUI (Material UI) v5
- Chart.js / react-chartjs-2
- Axios

**Backend**
- Node.js + Express 5

**Database**
- MongoDB (Mongoose ODM)

**Authentication**
- JWT (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`)

**External services**
- Market data: Yahoo Finance (`yahoo-finance2`) — no paid API key required
- AI assistant: Google Gemini (`@google/genai`, `gemini-2.5-flash`)

**Testing**
- Backend: Jest + Supertest, against an in-process MongoDB (`mongodb-memory-server`)
- Frontend: Jest + React Testing Library (bundled with Create React App)

**CI/CD**
- GitHub Actions (`.github/workflows/ci.yml`)

**Deployment**
- Frontend: Vercel (static build of `dashboard/`)
- Backend: Render (Node web service)

## Architecture

```
React Client (dashboard/)
        │  axios + JWT (Authorization: Bearer <token>)
        ▼
Express REST API (backend/)
        │
        ├── Services / business logic (auth, trading, portfolio, watchlist)
        │        │
        │        ▼
        │   MongoDB (users, orders, holdings, positions, watchlist)
        │
        ├── Yahoo Finance  (live quotes + historical price data)
        └── Google Gemini  (portfolio-aware AI assistant)
```

There is **one canonical frontend** (`dashboard/`), serving both the public marketing site and the
authenticated trading application from a single React Router tree — there is no separate marketing-site
codebase.

## Security

- **Passwords**: hashed with bcrypt (`bcryptjs`), never stored or logged in plaintext.
- **Authentication**: JWT, verified on every protected route; missing/malformed/expired tokens rejected with
  401. Login returns the same generic "Invalid credentials" message whether the account doesn't exist or the
  password is wrong, to resist user enumeration.
- **Authorization**: every trading/portfolio/watchlist endpoint derives the acting user from the verified JWT
  (`req.user.id`) — never from a client-supplied ID — so one user can never read or modify another user's
  orders, holdings, funds, or watchlist. Verified by a dedicated two-user test suite (`backend/tests/integration/authorization.test.js`).
- **Input validation**: server-side validation for email format, password length, username format, order
  symbol/quantity/mode, and AI-assistant question length — the backend is the final authority; the frontend's
  own validation is a UX convenience, not a security boundary.
- **Trading integrity**: order execution price always comes from a live quote fetched by the server, never
  from the client; balance and holding-quantity checks use atomic MongoDB updates to guard against
  double-spend races from concurrent/duplicate requests.
- **Rate limiting**: login, registration, order placement, and the AI assistant are all rate-limited
  per-IP/per-user, with sensible defaults, configurable via environment variables.
- **Security headers**: `helmet` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.).
- **CORS**: an explicit origin allowlist (never `*`), configurable via `ALLOWED_ORIGINS`.
- **Error handling**: unexpected errors are logged server-side in full but return a generic message to the
  client — no stack traces, file paths, or database error internals are ever exposed in an API response.
- **Secrets**: no credentials are committed to git; `.env` is gitignored in both apps, and `.env.example`
  contains placeholder values only.

## Testing

```bash
# Backend — 85 tests across 9 suites
cd backend
npm test                # run once
npm run test:coverage   # with a coverage report (backend/coverage/)

# Dashboard — 31 tests across 4 suites
cd dashboard
npm test                # watch mode
npm run test:coverage   # one-shot run with a coverage report (dashboard/coverage/)
npm run build            # production build
```

Backend tests run against a real, in-process MongoDB (`mongodb-memory-server`) — no external database and
nothing ever touches a developer/production database. Yahoo Finance and Gemini are both mocked
(`backend/tests/mocks/`), so the suite makes no real network/API calls and needs no real credentials.
Dashboard tests mock the shared API client (`dashboard/src/config/__mocks__/apiClient.js`), so no test depends
on a live backend. A GitHub Actions workflow runs both suites and the production build on every push and pull
request.

Coverage focuses on business-critical logic — authentication, cross-user authorization, order
execution/validation, portfolio math, watchlist CRUD, and AI-context isolation — rather than every UI pixel;
see the README section in git history / `backend/tests` and `dashboard/src/**/*.test.js` for the exact suites.

## Local Setup

### 1. Clone

```bash
git clone https://github.com/Jaineel22/TradeNova-MERN-Trading-Platform.git
cd TradeNova
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables)):

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3003
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm start
```

### 3. Dashboard (frontend)

```bash
cd dashboard
npm install
npm start
```

By default the dashboard talks to the deployed production API (`dashboard/src/config/api.js`). For local
development against your own backend, set `REACT_APP_API_URL=http://localhost:3003` (e.g. in
`dashboard/.env.development` or the shell environment) before `npm start`.

## Environment Variables

`backend/.env.example` documents every variable — copy it to `backend/.env` and fill in real values. It
contains placeholders only; no real secret is ever committed.

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Signs/verifies authentication tokens |
| `PORT` | No (defaults to 3003) | Backend listen port |
| `GEMINI_API_KEY` | No (AI assistant returns 503 if unset) | Google Gemini API key |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS allowlist override |
| `LOGIN_RATE_LIMIT_MAX`, `REGISTER_RATE_LIMIT_MAX`, `ORDER_RATE_LIMIT_MAX` (+ `*_WINDOW_MS`) | No | Rate-limit tuning |

The dashboard needs no secrets — `REACT_APP_API_URL` is the only variable, and it's a public API base URL,
not a credential.

## Deployment

- **Frontend**: `dashboard/` is deployed as a static build on Vercel (Vercel project root directory set to
  `dashboard/`; build command `npm run build`, output `dashboard/build/`).
- **Backend**: deployed as a Node web service on Render, running `npm start` from `backend/`.
- The backend's CORS allowlist (`backend/src/app.js`, overridable via `ALLOWED_ORIGINS`) must include whatever
  domain serves the deployed dashboard.

## Project Structure

```
TradeNova/
├── .github/workflows/     CI (GitHub Actions): backend tests, dashboard tests, production build
├── backend/
│   ├── src/
│   │   ├── controllers/     route handlers
│   │   ├── services/         business logic (auth, trading, portfolio, market data, watchlist, AI)
│   │   ├── models/            Mongoose schemas (User, Order, Holding, Position, Watchlist)
│   │   ├── middleware/         auth, rate limiting, error handling
│   │   ├── validators/         input validation
│   │   └── routes/              Express routers
│   └── tests/                unit + integration tests, mocks for Yahoo Finance and Gemini
├── dashboard/                 ← canonical frontend (public site + trading app)
│   ├── public/
│   └── src/
│       ├── components/          shared UI: cards, charts, trade dialog, state components
│       ├── context/              AuthContext (JWT session, ProtectedRoute)
│       ├── layout/                PublicLayout (marketing) + AppShell/Sidebar/Topbar (trading)
│       ├── pages/                  Home, About, Product, Pricing, Support, Login, Signup,
│       │                          Dashboard, Markets, Stock Detail, Orders, Holdings,
│       │                          Positions, Funds, Watchlist, AI Assistant
│       └── config/                  API base URL + axios client (JWT interceptor, 401 handling)
└── screenshots/               reference images
```

## Limitations

- **This is a paper-trading simulator, not a real brokerage.** No real money is ever involved, and the
  application is not connected to any real brokerage, exchange, or settlement system.
- Market prices come from Yahoo Finance's public data; they are suitable for a learning/demo tool, not for
  real trading decisions, and are not guaranteed real-time or exchange-accurate.
- "Positions" currently tracks delivery-style holdings only — intraday-style position tracking is not
  implemented, and the page says so rather than showing fabricated data.
- There is no historical portfolio-value chart (only a live snapshot) — the dashboard says so explicitly
  rather than inventing one.
- A handful of dashboard pages (Orders, Holdings, Positions, Funds, Markets, Stock Detail, the Login/Signup
  submit flows) are covered by backend integration tests and manual verification, but don't yet have
  dedicated React Testing Library component tests.
- No automated browser-based end-to-end suite runs in CI (see [Testing](#testing) for why, and what covers
  the same ground instead).

## Author

**Jaineel Hemnani** — Full Stack Developer
