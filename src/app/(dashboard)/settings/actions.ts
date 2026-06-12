'use server';

import { getAuthUser } from '@/lib/auth/get-user';
import { updateUserProfile, getUserById } from '@/lib/db/queries';
import { createClient } from '@/lib/supabase/server';

export async function getProfile() {
  const { dbUser } = await getAuthUser();
  return dbUser;
}

export async function updateProfileAction(data: { firstName: string; lastName: string }) {
  const { dbUser } = await getAuthUser();
  if (!dbUser) throw new Error('Not authenticated');

  const updated = await updateUserProfile(dbUser.id, {
    firstName: data.firstName,
    lastName: data.lastName,
  });

  return updated;
}

export async function changePasswordAction(newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) throw new Error(error.message);

  return { success: true };
}
