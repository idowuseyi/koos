import { createClient } from '@/lib/supabase/server';
import { ensureUser } from './sync-user';

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    return { supabaseUser: null, dbUser: null };
  }

  const dbUser = await ensureUser(supabaseUser);

  return { supabaseUser, dbUser };
}
