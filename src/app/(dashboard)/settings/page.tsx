import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const { dbUser } = await getAuthUser();
  if (!dbUser) redirect("/login");

  return (
    <SettingsClient
      user={{
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        hasPassword: Boolean(dbUser.passwordHash),
      }}
    />
  );
}
