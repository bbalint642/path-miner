
## Waitlist specifikációk (Security + Supabase tárolás)

### Cél
- **Email feliratkozások** fogadása a landing oldali “Join waitlist” formról.
- **Biztonság alapból**: bot/spam szűrés + túlterhelés csökkentése.
- **Perzisztencia**: Supabase Postgres DB-ben tárolás.
- **Dedup**: **egy email cím csak egyszer** szerepelhet a rendszerben.

---

## 1) Biztonsági szabályok

### 1.1 Honeypot mező (minimum védelem)
- **Mező neve**: `company` (honeypot).
- **Frontend**:
  - A form tartalmaz egy **rejtett** mezőt (jelenleg: `display: none`).
  - A valódi felhasználó ezt nem tölti ki.
- **Backend**:
  - Ha a kérésben a `company` **nem üres**, akkor a kérést **eldobjuk**.
  - Válasz: **200 OK** (szándékosan), hogy a bot ne kapjon visszajelzést arról, hogy lebukott.
- **Megjegyzés**:
  - A `display:none` megoldás egyszerű, de vannak botok, amik ezt is kihagyják; ettől függetlenül jó “minimum”.
  - Később erősebb megoldás lehet: “visually hidden” + CSS trükkök, illetve időalapú validáció (pl. form kitöltés minimum idő).

### 1.2 IP alapú rate limit
- **Cél**: brute/spam csökkentése és költség/DB terhelés védelem.
- **Implementáció**: `POST /api/waitlist` route-ban.
- **Kulcs**: kliens IP (header alapú).
  - Preferált headerek: `cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`.
  - `x-forwarded-for` esetén: **első IP** számít.
- **Ablak / limit** (jelenlegi beállítás):
  - 15 perc / IP: max **5** kérés.
- **Túllépés**:
  - HTTP **429** + `Retry-After` fejléc.
  - `X-RateLimit-*` headerek: limit, remaining, reset timestamp (unix seconds).
- **Fontos**:
  - A jelenlegi megoldás **in-memory** (Next.js instance memóriában).
  - Több instance / serverless skálázás esetén **nem globális**.
  - “Éles” megoldáshoz javasolt: Upstash Redis / Supabase KV / Cloudflare Rate Limiting.

### 1.3 Validáció és válaszstratégia
- **Email**: egyszerű formai ellenőrzés + max hossz (pl. 320).
- **Consent**: a feliratkozás feltétele (pl. `consent: true`).
- **Hibák**:
  - 400: invalid email / consent hiány.
  - 429: rate limit.
  - 200: siker (és honeypot drop esetén is).

---

## 2) Supabase DB integráció – követelmények

### 2.1 Tárolandó adatok (minimum)
Javasolt tábla: `waitlist_signups`
- **id**: `uuid` (default `gen_random_uuid()`).
- **email**: `text` (kötelező).
- **consent**: `boolean` (kötelező, default `false`).
- **created_at**: `timestamptz` (default `now()`).
- **ip**: `text` (opcionális; adatvédelmi okokból mérlegelendő).
- **user_agent**: `text` (opcionális).
- **source**: `text` (opcionális; pl. `"landing"`).

### 2.2 Dedup: egy email csak egyszer
Követelmény: **ugyanazt az email címet nem tárolhatjuk többször**.

Ajánlott DB-s megoldás (robosztus):
- **Unique index** az emailre **normalizált formában**.

Normalizálási javaslat:
- `email_normalized` generált mező (vagy insertkor számoljuk):
  - `lower(trim(email))`

Opció A (ajánlott): külön oszlop + unique index
- `email_normalized text generated always as (lower(trim(email))) stored`
- `unique(email_normalized)`

Opció B: expression unique index
- `create unique index ... on waitlist_signups ((lower(trim(email))));`

### 2.3 API viselkedés duplikált emailnél
Két elfogadható stratégia (válasszunk egyet):
- **Szigorú**: duplikált esetén 409 (Conflict) és UI-ban “már fel vagy iratkozva”.
- **Idempotens (javasolt UX)**: duplikált esetén is **200 OK** (mintha sikerült volna).
  - Ennek előnye: kevesebb “email enumeration” jellegű információ kiszivárgás.
  - A DB oldali unique constraint így is garantálja a “csak egyszer” szabályt.

### 2.4 RLS (Row Level Security) + hozzáférés
Ajánlott:
- A `waitlist_signups` táblán **RLS ON**.
- A kliens (anon) **ne** írjon közvetlenül a táblába.
- A beszúrás a Next.js backendből történjen **Supabase Service Role** kulccsal (csak szerveren).

### 2.5 Titkok / konfiguráció
Szükséges env változók (példa elnevezés):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (csak szerveren, soha ne kerüljön a böngészőbe)

### 2.6 Audit / naplózás (minimális)
- Logoljunk “event” szinten:
  - sikeres feliratkozás (email),
  - honeypot drop,
  - rate limit block,
  - DB error.
- **Ne** logoljunk túl sok PII-t (pl. IP, UA csak ha tényleg kell).

---

## 3) Implementációs checklist (amikor kötjük a Supabase-t)
- [ ] Supabase: `waitlist_signups` tábla létrehozása + defaultok.
- [ ] Unique constraint/index az email normalizált értékére.
- [ ] RLS bekapcsolása, és policy-k beállítása (vagy service-role only).
- [ ] Next.js: Supabase server kliens/service role bekötése az `app/api/waitlist/route.ts` route-ba.
- [ ] Duplikált email kezelés eldöntése (409 vs 200 idempotens).
- [ ] UI: 429 esetén “túl sok próbálkozás, próbáld később” üzenet.
- [ ] Adatkezelési tájékoztató: megőrzési idő + törlés/opt-out folyamat.

## 3) Supabase (SQL / DDL)

Az alábbi SQL-t a Supabase **SQL Editor**-ban futtasd. Ez a séma kompatibilis a fenti szabályokkal (honeypot + rate limit az appban, DB-ben pedig **egy email csak egyszer**).

```sql
-- Waitlist tábla (Supabase Postgres)
-- Megjegyzés: a service_role kulcs (backend) RLS-t megkerül (bypass),
-- így "service-role-only" modellben nem kell INSERT policy.

create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),

  -- Eredeti email (ahogy beküldték)
  email text not null,

  -- Normalizált email deduplikáláshoz (case-insensitive + trim)
  -- (Supabase/Postgres 12+ esetén a generated stored mező ok)
  email_normalized text generated always as (lower(trim(email))) stored,

  consent boolean not null default false,

  -- Opcionális meta (PII -> csak ha kell)
  ip text,
  user_agent text,
  source text,

  created_at timestamptz not null default now()
);

-- Egy emailt csak egyszer tárolhatunk
create unique index if not exists waitlist_signups_email_normalized_key
  on public.waitlist_signups (email_normalized);

-- Praktikus index időrendi lekérdezéshez
create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

-- RLS: kliens (anon) ne írjon közvetlenül
alter table public.waitlist_signups enable row level security;

-- Service-role-only modell:
-- NEM hozunk létre anon/auth policy-t.
-- (Így az anon/auth role-ok nem tudnak olvasni/írni; a backend service_role igen.)
```

### Duplikált email kezelése a backendben (javasolt)
- **Idempotens UX**: beszúrás `on conflict (email_normalized) do nothing` jelleggel (Supabase `upsert`/`insert` + `ignoreDuplicates`).
- UI felé **200 OK** is mehet akkor is, ha már létezett az email.