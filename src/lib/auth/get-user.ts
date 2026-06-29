import { cookies } from "next/headers";
import { cache } from "react";
import { SESSION_COOKIE, validateSessionToken } from "./session";

/**
 * Resolve the currently authenticated user from the session cookie.
 * Returns `{ dbUser: null }` when there is no valid session.
 *
 * Wrapped in React `cache()` so multiple callers within the same request — e.g.
 * the dashboard layout and the page it renders — share a single session lookup
 * instead of each hitting the database.
 */
export const getAuthUser = cache(async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return { dbUser: null };

  const result = await validateSessionToken(token);
  return { dbUser: result?.user ?? null };
});
