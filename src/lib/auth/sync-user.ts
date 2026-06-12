import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import type { User } from '@supabase/supabase-js';

export async function ensureUser(supabaseUser: User) {
  const email = supabaseUser.email ?? '';
  const meta = supabaseUser.user_metadata ?? {};
  const firstName = meta.first_name ?? meta.full_name?.split(' ')[0] ?? 'User';
  const lastName =
    meta.last_name ??
    meta.full_name?.split(' ').slice(1).join(' ') ??
    '';
  const avatarUrl = meta.avatar_url ?? meta.picture ?? null;

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const provider = supabaseUser.app_metadata?.provider as 'email' | 'google' ?? 'email';

  const [newUser] = await db
    .insert(users)
    .values({
      id: supabaseUser.id,
      firstName,
      lastName,
      email,
      avatarUrl,
      provider,
    })
    .returning();

  return newUser;
}
