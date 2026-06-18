"use server";

import { getAuthUser } from "@/lib/auth/get-user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { updateUserPassword, updateUserProfile } from "@/lib/db/queries";

export async function updateProfileAction(data: {
  firstName: string;
  lastName: string;
}) {
  const { dbUser } = await getAuthUser();
  if (!dbUser) throw new Error("Not authenticated");

  const updated = await updateUserProfile(dbUser.id, {
    firstName: data.firstName,
    lastName: data.lastName,
  });

  return updated;
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
) {
  const { dbUser } = await getAuthUser();
  if (!dbUser) throw new Error("Not authenticated");
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  // Users who already have a password must confirm the current one. Google-only
  // accounts (no passwordHash yet) are setting a password for the first time.
  if (dbUser.passwordHash) {
    const ok = await verifyPassword(dbUser.passwordHash, currentPassword);
    if (!ok) throw new Error("Current password is incorrect.");
  }

  await updateUserPassword(dbUser.id, await hashPassword(newPassword));
  return { success: true };
}
