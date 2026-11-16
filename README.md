# Car Renting API

A NestJS REST API with cookie-session authentication and a **used-car price estimation** feature: users submit reports of car sales (make, model, year, mileage, location, price), an admin approves them, and anyone can request an estimated price based on similar approved reports.

> **Status:** early development (v0.0.1). Car inventory, bookings, payments and reviews are **not implemented yet** — see [Roadmap](#roadmap).

## Tech stack

- **NestJS 11** (Express platform)
- **TypeORM 0.3** + **SQLite** (`sqlite3`)
- **class-validator / class-transformer** for request validation and response serialization
- **cookie-session** for authentication (session cookie, no JWT)
- **@nestjs/config** for environment variables

## Requirements

- Node.js **20+** (Nest 11 requirement)
- npm

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file from the template
cp .env.example .env.development

# 3. Set COOKIE_KEY in .env.development to a long random string:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Start the server in watch mode
npm run start:dev
```

The API runs at `http://localhost:4000` (or the `PORT` you set). The SQLite file (`db.sqlite`) is created automatically and the schema is synced from the entities on startup (`synchronize: true`).

## Environment variables

The app loads `.env.<NODE_ENV>` — e.g. `.env.development` for `npm run start:dev`, `.env.test` for the test scripts. Only `.env.example` is committed; real `.env.*` files are git-ignored.

| Variable     | Required | Example     | Description                                                      |
| ------------ | -------- | ----------- | ---------------------------------------------------------------- |
| `PORT`       | no       | `4000`      | HTTP port (defaults to `4000`)                                   |
| `DB_NAME`    | **yes**  | `db.sqlite` | SQLite database file path                                        |
| `COOKIE_KEY` | **yes**  | random hex  | Secret used to sign the session cookie — the app won't start without it |

`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` are read only by the Postgres config in `src/config/database.config.ts`, which the running app does not use yet.

## Scripts

| Command               | What it does                                             |
| --------------------- | -------------------------------------------------------- |
| `npm run start:dev`   | Start in watch mode (`NODE_ENV=development`)             |
| `npm run start`       | Start once without watch                                 |
| `npm run start:debug` | Start in watch mode with the Node inspector              |
| `npm run build`       | Compile to `dist/`                                       |
| `npm run start:prod`  | Run the compiled build (see [Known issues](#known-issues)) |
| `npm run lint`        | Run ESLint (with `--fix`)                                |
| `npm run format`      | Format with Prettier                                     |
| `npm run typeorm`     | TypeORM CLI using `data-source.ts`                       |

## Authentication

Authentication is session-based. `POST /auth/signup` or `POST /auth/signin` sets a signed session cookie; send it back on later requests. With curl, use a cookie jar:

```bash
curl -c cookies.txt -b cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}' \
  http://localhost:4000/auth/signup

curl -c cookies.txt -b cookies.txt http://localhost:4000/auth/whoami
```

## API endpoints

**Access:** Public = no login · User = logged in · Admin = logged-in user with `admin = true`

### Auth & users — `/auth`

| Method   | Path            | Access | Body / query                          | Response                     |
| -------- | --------------- | ------ | ------------------------------------- | ---------------------------- |
| `POST`   | `/auth/signup`  | Public | `{ email, password }`                 | `{ id, email }` + session cookie |
| `POST`   | `/auth/signin`  | Public | `{ email, password }`                 | `{ id, email }` + session cookie |
| `POST`   | `/auth/signout` | Public | —                                     | empty (clears session)       |
| `GET`    | `/auth/whoami`  | User   | —                                     | `{ id, email }`              |
| `GET`    | `/auth`         | Public | query `email`                         | `[{ id, email }]`            |
| `GET`    | `/auth/:id`     | Public | —                                     | `{ id, email }` or 404       |
| `PATCH`  | `/auth/:id`     | Public | `{ email?, password? }`               | `{ id, email }`              |
| `DELETE` | `/auth/:id`     | Public | —                                     | `{ email }`                  |

### Reports — `/reports`

| Method  | Path           | Access | Body / query | Response |
| ------- | -------------- | ------ | ------------ | -------- |
| `POST`  | `/reports`     | User   | `{ make, model, title, year, mileage, lng, lat, price }` | created report |
| `PATCH` | `/reports/:id` | Admin  | `{ approved: boolean }` | updated report |
| `GET`   | `/reports`     | Public | query `make, model, title, year, mileage, lng, lat` | `{ avgPrice }` (`null` if no match) |

Validation rules for reports: `year` 1930–2025, `mileage` 0–100000, `price` 0–1000000, `lat`/`lng` valid coordinates.

The estimate averages the price of **approved** reports with the same make and model, within ±5° lat/lng and ±3 years.

```bash
curl "http://localhost:4000/reports?make=toyota&model=corolla&title=x&year=2020&mileage=5000&lng=31&lat=30"
```

### Misc

| Method | Path | Response                  |
| ------ | ---- | ------------------------- |
| `GET`  | `/`  | `Hello World!` (Nest default) |

## Project structure

```
src/
├── main.ts                     # Bootstrap: cookie session, global ValidationPipe, port
├── app.module.ts               # Root module: config, TypeORM (SQLite), session middleware
├── config/database.config.ts   # Per-environment DB options (used by data-source.ts)
├── guards/                     # AuthGuard (logged in), AdminGuard (admin flag)
├── interceptors/               # @Serialize() — DTO-based response shaping
├── migrations/                 # TypeORM migrations (app currently uses synchronize instead)
├── types/express.d.ts          # Adds req.currentUser to Express types
├── users/                      # Signup/signin, user CRUD, current-user middleware & decorator
└── reports/                    # Report entity, create/approve, price estimate
data-source.ts                  # DataSource for the TypeORM CLI
```

## Database

- **user**: `id`, `email`, `password` (scrypt hash as `salt.hash`), `admin` (boolean)
- **report**: `id`, `title`, `make`, `model`, `year`, `mileage`, `lat`, `lng`, `price`, `approved`, `userId` → `user.id`

## Known issues

These exist in the current code and are tracked for fixing:

- **New users are admins by default** (`admin` column defaults to `true`), so `AdminGuard` doesn't restrict anything in practice.
- **User CRUD routes are unauthenticated.** Anyone can list, update or delete any user; `PATCH /auth/:id` with a `password` stores it **unhashed**, which also breaks signin for that user.
- `npm run start:prod` points to `dist/main`, but the build emits `dist/src/main.js` because root-level `.ts` files (`data-source.ts`, `orm.config.ts`, `jest.config.ts`) are compiled too.
- The estimate endpoint requires an unused `title` query param, and the average isn't limited to the 3 closest-mileage reports (`LIMIT` doesn't apply inside `AVG`).
- `lat`/`lng` columns are integers, so coordinates are truncated when read back.
- `ReportDTO.userId` returns the report's id, not the user's id.

## Roadmap

- [ ] Fix the known issues above
- [ ] Car inventory module
- [ ] Bookings / reservations
- [ ] Payments
- [ ] User reviews
- [ ] Postgres for production + migrations instead of `synchronize`

## License

UNLICENSED — all rights reserved.
