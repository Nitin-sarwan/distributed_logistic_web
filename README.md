# LogisticPartner — Frontend

On-demand logistics platform. React + TypeScript + Vite.

**Phase 1 scope: the User Service only** — signup, login, session state, profile,
saved addresses, logout. No order, payment, dispatch, partner, location, or
notification UI. The structure is built so those slot in without rework.

---

## Running it

```powershell
npm install
npm run dev            # http://localhost:5173
```

The backend must be running too — from `distributed_logistic_msrv`, two
terminals with the venv active:

```powershell
uvicorn src.services.userServices.main:app --port 8001 --reload   # service
uvicorn src.gateway.main:app --port 8000 --reload                 # gateway
```

| script | does |
| --- | --- |
| `npm run dev` | dev server on :5173 |
| `npm run build` | typecheck then production build |
| `npm run typecheck` | types only |
| `npm run preview` | serve the built output |

---

## Architecture

```
src/
├── app/            application setup — router, providers, shell
├── components/     generic UI. Knows nothing about any feature.
├── features/       business functionality, one folder each
│   ├── auth/       login, signup, session, logout
│   └── profile/    profile details, saved addresses
├── pages/          route-level screens. Compose features; no API calls.
├── services/       infrastructure — the API client, session transport
├── constants/      route paths, API paths
├── types/          shared types
└── utils/          formatting helpers
```

### The rule that keeps this scalable

**Dependencies point one way: `pages → features → services`.**

- `components/` never imports from `features/`. A component that reads auth
  state cannot be reused, so `Header` receives `user` and callbacks as props and
  is wired once in `app/App.tsx`.
- `pages/` never calls an API. They read from feature hooks and render. Every
  page in this app would still compile if the backend changed shape.
- Each feature exposes a public surface through its `index.ts`. Nothing outside
  reaches into a feature's internals.

Adding orders later is: `features/orders/` with the same
`api/ components/ hooks/ types.ts` shape, a block in `constants/api.ts`, and
routes in `app/router.tsx`. Nothing existing changes.

---

## The gateway is the only backend the frontend knows

```
React  ──HTTP──▶  API Gateway :8000  ──▶  User Service :8001  ──▶  Postgres + Mongo
```

`VITE_API_URL` points at the gateway and that is the whole of the frontend's
knowledge of backend topology. Service ports appear nowhere in `src/` — the
gateway routes `/api/users/*` onward by prefix, and which process answers is
not the browser's business.

All paths live in [`src/constants/api.ts`](src/constants/api.ts). One axios
instance exists, in [`src/services/apiClient.ts`](src/services/apiClient.ts);
features use its typed helpers rather than creating their own.

> Your spec used `/auth/login`, `/auth/me`, `/auth/logout`. The gateway actually
> exposes `/api/users/login`, `/api/users/profile`, `/api/users/logout`. The real
> paths are used, mapped in one file — renaming is a one-line change.

---

## Authentication

Session-based, over an **HttpOnly cookie**. **No JWT, and no credential in
`localStorage` or `sessionStorage`** — verified in a browser: after signup both
are empty and `document.cookie` is `""`.

The tokens the backend issues are already sessions in every sense that matters:
opaque AES-encrypted blobs with no readable claims, backed by a Mongo session
record, revocable server-side instantly. Logout is a real revocation, not a
client-side forget.

### How the app knows you are signed in

One request at startup, never a storage check:

```
App starts ─▶ GET /api/users/profile ─┬─ 200 ─▶ authenticated, user in state
                                      └─ 401 ─▶ unauthenticated
```

`isLoading` stays true until that answers, so a protected page never flashes a
redirect at a signed-in user on reload. Auth state lives in
[`features/auth/authStore.tsx`](src/features/auth/authStore.tsx) — React context
plus a reducer, no state-management dependency for three fields.

### Session transport

The backend sets an **HttpOnly session cookie** (`lp_session`) on register,
login, and refresh, and clears it on logout, logout-all, change-password, and
reset-password. `extract_token()` accepts it alongside the header forms.

[`services/sessionTransport.ts`](src/services/sessionTransport.ts) is the single
seam, switched by `VITE_AUTH_TRANSPORT`:

| mode | credential | frontend stores |
| --- | --- | --- |
| `cookie` *(default)* | HttpOnly cookie, browser-managed | **nothing** |
| `bearer` | `Authorization: Bearer <token>` | in memory only |

`withCredentials: true` is on in **both**, so switching is one env variable — no
feature, hook, or component changes. `bearer` stays supported because
non-browser clients have no cookie jar; headers win over the cookie when both
are present, so an explicit credential always beats an ambient one.

Verified in a browser: after signup, `localStorage` and `sessionStorage` are
both empty, `document.cookie` is `""` (HttpOnly, so no script can read it), and
`GET /api/users/profile` with no `Authorization` header returns 200 — which is
precisely what a page reload does.

The `refresh_token` from login is **dropped**, not stored — keeping a 30-day
credential would mean exactly the persistence this app refuses.

#### Cookie attributes, and why

`HttpOnly` (no script can read it) · `SameSite=Lax` · `Max-Age` = the token's own
lifetime · `Path=/`.

A cookie is attached by the browser automatically, so unlike a bearer header it
is exposed to CSRF. `SameSite=Lax` closes that: a cross-site POST gets no
cookie, and a cross-site GET cannot read the response because the gateway lists
explicit CORS origins. **If you ever move the frontend to a different
registrable domain** you would need `SameSite=None; Secure`, which removes this
protection — add CSRF tokens if you do.

`session_cookie_secure` defaults to **false** so plain-HTTP local development
works. It **must be true in production**: over HTTP the cookie is readable by
anyone on the network, which defeats the point of HttpOnly.

> **`VITE_API_URL` must use `localhost`, not `127.0.0.1`.** Ports are not part
> of a "site", so `localhost:5173 → localhost:8000` is same-site and the Lax
> cookie is sent. Hosts *are*, so `localhost → 127.0.0.1` is cross-site and the
> browser silently drops the cookie on every request.

### CORS

Handled at the gateway — the only browser-facing origin — in
`src/gateway/main.py`:

- explicit origin list from `CORS_ALLOW_ORIGINS`, never `*`, because a wildcard
  with `allow_credentials=True` is rejected by every browser
- `Authorization` and `X-Token` in `allow_headers`
- preflight cached 600s, and answered before routing so an OPTIONS request
  carrying no credential is not rejected as unauthenticated

Services behind the gateway deliberately have **no** CORS middleware: they are
never called from a browser, and a second `Access-Control-Allow-Origin` on one
response is a hard failure, not extra permissiveness. The proxy strips any
`access-control-*` header from upstream so this stays true if one adds it later.

Verified: `http://localhost:5173` gets `allow-credentials: true` with an explicit
origin; an unlisted origin is refused with 400.

Add a deployed frontend origin to `CORS_ALLOW_ORIGINS` in the backend `.env`.

---

## Decisions worth knowing

**Registration logs you in.** The backend issues a session as part of
`POST /register`, so there is no "account created, now sign in" step. One
behaviour, consistently.

**Auth is a modal, not a route.** Logging in from the home page leaves the
pickup and drop locations you already typed intact. `useRequireAuth` carries the
interrupted action across the login and resumes it afterwards.

**Track Order is public.** Tracking uses an order id, so someone sent a delivery
reference can use it without an account. It and My Orders are primary nav, never
inside the profile dropdown — that holds account actions only.

**Validation is Joi + react-hook-form.** Schemas live in each feature's
`validation.ts`, with `abortEarly: false` so every bad field reports at once
rather than one per submit, and `convert: true` so email is trimmed and
lowercased exactly as the backend normalises it. Joi infers no types, so each
form's values interface is declared by hand next to its schema — keep the two in
step, because TypeScript cannot catch a field added to only one. Joi costs about
45 KB gzip more than a type-inferring alternative; that is the trade.

Client validation is **UX only**. The backend revalidates everything and stays
the source of truth.

**Backend errors are never shown raw.** `services/httpError.ts` maps every
status to presentable wording, and pulls field-level messages out of FastAPI's
422 body so they land on the right input. A 409 on signup marks the email or
phone specifically. Login's "Invalid email or password" is kept deliberately
ambiguous — distinguishing the two would let someone enumerate registered
addresses.

**Every async operation has a loading state,** and buttons disable while in
flight — a second click on Login would open a second session.

---

## Known backend gaps this frontend is built against

| Gap | What the UI does |
| --- | --- |
| **No `PATCH /profile`.** Name and phone are read-only server-side. | Profile shows details read-only. No edit control that could not succeed. |
| **No Order Service.** | Track Order / My Orders are inert placeholder pages. No order types, no API calls, nothing to unpick later. |

### Phone is required, at every layer

`RegisterUser.phone: str` (no default) · model `nullable=False` · column
`NOT NULL` · `User.phone: string` in the frontend · required in the signup form.

This previously disagreed — the schema said optional while the column did not,
so registering without a phone got past validation and died at the insert with a
**500**. Fixed backend-side; verified: missing, empty, and short phones all now
return a clean **422** naming the field, and a valid one returns **201**.

Note `USER_SERVICE.md` still says "`phone` is optional" — that line is stale.

## Saved addresses

Built on both ends. All four endpoints require a session:

```
GET    /api/users/addresses        -> Address[]
POST   /api/users/addresses        -> Address   (201)
PATCH  /api/users/addresses/{id}   -> Address
DELETE /api/users/addresses/{id}   -> 204
```

```jsonc
{ "id": 1, "user_id": 7,
  "address_line1": "…", "address_line2": null,
  "city": "Bengaluru", "pin_code": "560001",
  "latitude": 12.971599, "longitude": 77.594566 }
```

**`user_id` is never accepted from the client.** It comes from the session, and
every query is scoped by it in the `WHERE` clause rather than fetched and
checked afterwards — an ownership check that lives in the query cannot be
forgotten. A request for someone else's address id gets **404**, not 403:
answering 403 would confirm the id exists.

Frontend: list, add, delete (`features/profile/`). `PATCH` exists server-side
for the edit flow, which is deliberately not in this first iteration.

Coordinates are `NUMERIC(9,6)` — about 10cm. The backend rounds to six decimal
places on input, so a nine-decimal GPS reading is stored rather than rejected,
and `179.1234567` cannot overflow the nine-digit limit. The client coerces with
`Number()` either way, since `NUMERIC` is sometimes serialised as a string.

> **Requires migration `a1c4e07b92d3`.** The original `user_address` migration
> declared `id` without a `PrimaryKeyConstraint`, so the table had no primary
> key and no sequence — `id` was NOT NULL with nothing to fill it and every
> insert failed. That migration adds the PK, makes `id` an identity column, and
> indexes `user_id`.

---

## Security

- No password is retained after submit — it exists only for the duration of the
  request.
- No token in `localStorage` or `sessionStorage`; the session cookie is
  `HttpOnly`, so no script can read it either.
- Set `SESSION_COOKIE_SECURE=true` in the backend `.env` for any deployment.
- No service URL exposed; the browser talks to the gateway alone.
- `RequireAuth` decides what *renders*, and is not a security boundary. The
  backend re-authenticates every request, so bypassing it yields a page whose
  data calls all 401.
- Nothing secret belongs in a `VITE_` variable — they are inlined into the
  bundle and readable by anyone.
