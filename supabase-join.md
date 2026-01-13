##.env.local:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=

# Waitlist (server-only) inserthez még ez IS kell:
# (Ezt soha ne add NEXT_PUBLIC_* néven!)
SUPABASE_SERVICE_ROLE_KEY=

## Vercel (fontos)
- A waitlist endpoint (`POST /api/waitlist`) **csak akkor működik**, ha a Vercel-en is be vannak állítva az env változók.
- Minimum kell:
  - `NEXT_PUBLIC_SUPABASE_URL` (vagy `SUPABASE_URL`)
  - `SUPABASE_SERVICE_ROLE_KEY` (**server-only**, ne legyen `NEXT_PUBLIC_*`)
- A Vercel UI-ban: **Project → Settings → Environment Variables**.
  - Figyelj rá, hogy a megfelelő környezet(ek)re is felvedd: **Production** / **Preview** / **Development**.
- Env var hozzáadása/módosítása után **Redeploy** kell (különben a már kint lévő deployment még a régi env-vel fut).

##page.tsx

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li>{todo}</li>
      ))}
    </ul>
  )
}


##utils/server.ts

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};


##utils/supabase/client.ts:


import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );


##utils/supabase/middleware.ts


import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

---

## Megjegyzés (fontos): publishable/anon vs service_role

- `NEXT_PUBLIC_SUPABASE_*` változók (URL + publishable/anon key) **nem titkosak** → kikerülnek a böngészőbe.
  - Ezek jók Supabase Auth / session / “user context” műveletekhez.
- A waitlist email beszúrása nálunk **nem** Auth-hoz kötött, és a táblán **RLS ON** van policy nélkül,
  ezért a publikus kulccsal a beszúrás **nem megbízható / nem biztonságos**.
- Ezért a `POST /api/waitlist` endpoint szerveren **service role** kulccsal ír a DB-be:
  - `SUPABASE_SERVICE_ROLE_KEY` (szerver-only env var)

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse
};
