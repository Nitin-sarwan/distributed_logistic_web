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
│   ├── booking/    the pickup → drop trip
│   ├── geo/        address search, reverse lookup, the location picker
│   ├── partner/    the driver app — availability, vehicles, position
│   └── profile/    profile details, saved addresses
├── hooks/          hooks that mention no domain concept
├── pages/          route-level screens. Compose features; no API calls.
├── services/       infrastructure — HTTP client, error mapping, session transport
├── constants/      route paths, API paths
├── types/          shared types + global.d.ts (ambient declarations)
└── utils/          formatting helpers
```

Every feature has the same inside:

```
features/<name>/
├── api/            one module per group of endpoints
├── components/     presentation. Markup and ARIA, little else.
├── context/        provider + reducer + context object, where state is shared
├── hooks/          the feature's behaviour
├── types.ts        (or types/ when it describes more than one thing)
├── utils.ts        pure helpers
├── constants.ts    values mirrored from the backend, and copy
└── index.ts        the public surface — the only file anyone else imports
```

### The rules that keep this scalable

**Dependencies point one way: `pages → features → services`.**

- `components/` never imports from `features/`. A component that reads auth
  state cannot be reused, so `Header` receives `user` and callbacks as props and
  is wired once in `app/App.tsx`. `components/Map` is the same rule applied to
  the map: it takes coordinates and gives back coordinates, and knows nothing
  about pickups, addresses, or drivers. What those coordinates *mean* is
  `features/geo/`.
- `pages/` never calls an API. They read from feature hooks and render. Every
  page in this app would still compile if the backend changed shape.
- Each feature exposes a public surface through its `index.ts`. Nothing outside
  reaches into a feature's internals.

**Behaviour lives in hooks; components render.** A component with a `useState`,
a `useEffect`, and a `try/catch` around an API call is three responsibilities in
one file and cannot be read, tested, or reused separately. So `AvailabilityToggle`
renders and `useAvailability` decides; `AddressForm` renders and `useAddressForm`
decides; `MapView` composes six hooks and owns no behaviour of its own.

**`src/hooks/` is for hooks with no domain.** The test is whether the name
mentions a business concept. `useCombobox` lists items — it cannot tell an
address from a vehicle — so it is shared. `usePlaceSearch` geocodes, so it
belongs to `features/geo/`.

**No file over ~150 lines.** Not a lint rule, a smell test: past that, a file is
usually doing two things. The splits above came from applying it —
`partnerAuthStore.tsx` (316) became a reducer, a context, a provider, and two
hooks, each of which says one thing.

**Shared machinery, not copied machinery.** `useIsMounted`, `useSessionProbe`,
`useSessionExpiry`, `useApiFormErrors`, and `errorMessage()` each exist because
the same twelve lines had appeared in two places and were already drifting
apart.

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

They are set on a map, not typed. See [Maps and coordinates](#maps-and-coordinates).

> **Requires migration `a1c4e07b92d3`.** The original `user_address` migration
> declared `id` without a `PrimaryKeyConstraint`, so the table had no primary
> key and no sequence — `id` was NOT NULL with nothing to fill it and every
> insert failed. That migration adds the PK, makes `id` an identity column, and
> indexes `user_id`.

---

## Maps and coordinates

Every place in this app is a point, not a line of text. A driver is routed to
coordinates; the address is how a human confirms the pin is the right one.

### Leaflet, no API key

```
components/Map/MapView.tsx    a thin wrapper over Leaflet — tiles, pins, a line
features/geo/                 what the coordinates mean
```

[Leaflet](https://leafletjs.com/) (~150KB, its own cached chunk) with
OpenStreetMap raster tiles. No key, no account, no per-request billing.
`MapView` is about eighty lines of Leaflet rather than a second abstraction over
it — react-leaflet would be another API to learn and another release train to
keep in step with, for a map that needs tiles, a few pins, and a dashed line.

Two details worth knowing before editing it:

- **Pins are `divIcon`s, not images.** Leaflet's default marker is a PNG it
  loads by URL, which bundlers rewrite and Leaflet then cannot find — the
  classic broken-marker-icon bug. A `div` styles from `Map.css`, inherits the
  palette, and cannot 404.
- **Leaflet owns the inner element; React owns the frame.** Two owners on one
  DOM subtree is how `NotFoundError: failed to remove child` appears on unmount.

Tiles are the one resource the browser fetches directly rather than through the
gateway: they are images, and proxying them would add a hop to each of the ~20
requests a single map view makes and buy nothing.

### Three basemaps

`components/Map/tileStyles.ts` — **street**, **light**, and **dark**, switchable
from the control on any interactive map. All three are key-free: street is
OpenStreetMap's own raster tiles, light and dark are CARTO's basemaps, whose
licence requires their attribution alongside OSM's. Both strings are in the tile
definitions and Leaflet's attribution control is never disabled.

The choice is a `useSyncExternalStore` module store persisted to
`localStorage`, so it applies to *every* mounted map at once and survives a
reload. Switching to a map on one screen and leaving the thumbnails on another
in daylight would read as a bug.

**Dark is a basemap, not a site theme.** Only what sits on the tiles changes —
controls, attribution, the ring around each pin. Repainting the application
around it is a different feature with a different switch.

`VITE_MAP_TILE_URL` / `VITE_MAP_ATTRIBUTION` override the **street** style only,
which is the slot a keyed provider (MapTiler, Stadia, Thunderforest — all the
same `{z}/{x}/{y}` shape) would take.

### Fullscreen, and how the picker survives it

The expand control uses the Fullscreen API, falling back to a fixed overlay
where that is refused — iOS Safari has no element fullscreen, and a permissions
policy can block it in an iframe. Esc exits either way.

The API promotes **one element**, which is why `MapView` takes an `overlay` prop:
the location picker's centre pin and its "use my location" button render inside
the map's frame rather than beside it. As siblings they would stay behind in the
page, and the fullscreen map would have no pin to place.

### Scrolling, zooming, and the stacking context

Three fixes worth knowing, because each looks like a Leaflet bug until you know
which one it is:

- **The wheel zooms, always.** Trackpad pinch included — a pinch is not a touch
  event, it is a wheel event with `ctrlKey` set, so anything that filters wheel
  events filters pinch too. Two-finger pinch on a touchscreen goes through
  Leaflet's `touchZoom` separately. The cost of this is real and was chosen
  knowingly: a wheel over the map zooms rather than scrolling the page past it.
- **`isolation: isolate` on `.map-frame`.** Leaflet numbers its panes 400 and
  its controls 800–1000 — above this application's entire range, where the modal
  backdrop is 100 and the header 50. `position: relative` alone creates no
  stacking context, so a map on the page painted straight over the login and
  signup dialogs. Isolating makes the whole map stack as one element in document
  order.
- **Every z-index inside the map is now local.** Which is why the suggestion
  list dropped from 500 to 30: it only ever needed to beat the map, and a number
  chosen to beat Leaflet also beat the dialog.

### Address lookup goes through the gateway

```
GET /api/geo/search?q=indiranagar&limit=5&lat=&lng=   -> Place[]
GET /api/geo/reverse?lat=&lng=                        -> { latitude, longitude, place }
```

**The only two endpoints in this app that work signed out.** The home page lets
someone describe a delivery before being asked who they are, and a search box
that demanded an account would undo that. The backend bounds the exposure with a
per-IP quota, a process-wide throttle, and a shared cache — see the backend's
`docs/GEO.md`.

The frontend never calls a geocoding provider directly. The provider requires an
identifying User-Agent and one request per second; a browser can honour neither,
since every tab would be its own rate limiter.

`place` comes back `null` for a field, a new road, or the middle of a lake. That
is a `200`, and the UI treats it as such: the pin is valid, only the text is
missing.

### Where maps appear

| Screen | What the map does |
| --- | --- |
| Home — booking widget | Pickup and drop search, both pins, straight-line distance |
| Saved addresses — card | A still thumbnail, for recognising a place at a glance |
| Saved addresses — form | `LocationPicker`: search, device location, or drag the pin |
| Partner dashboard | The driver's last known position, and whether it is stale |

### The three ways to set a point

Search, the device's own position, or dragging the map. None of them covers
everybody: a warehouse gate, a site entrance, and the correct side of a divided
road are all places a geocoder cannot name and a person can point at. Dragging
is the fallback that always works, which is why the pin is fixed at the centre
of the frame and the map moves under it — on a phone that is the difference
between a gesture that works and one that fights the finger covering the target.

The latitude and longitude fields on the address form are still there, collapsed
behind "Enter coordinates manually". They are no longer how anyone is *expected*
to enter a location, but they are how to paste a pin someone was given, and they
are what keeps the form usable if the tile server is unreachable.

### Two rules the picker follows

- **A lookup is a suggestion; typed text is a decision.** Dragging the pin fills
  only the address fields that are still empty. Someone who wrote "Gate 3,
  behind the loading bay" does not lose it to a road name.
- **A move that changed nothing is not a choice.** Leaflet fires `moveend` for
  its own `setView` and for the resize measurement exactly as it does for a
  drag. Reporting those would have had an untouched picker claim the default
  city centre as a placed pin.

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
