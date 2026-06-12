import { getAuthUser } from "@/lib/auth/get-user";
import { getBrandsByUserId } from "@/lib/db/queries";
import ChatClient from "./chat-client";

export default async function ChatPage() {
  const { dbUser } = await getAuthUser();

  const brands = dbUser ? await getBrandsByUserId(dbUser.id) : [];

  const user = dbUser
    ? {
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl,
      }
    : { firstName: "User", lastName: "", email: "", avatarUrl: null };

  return <ChatClient brands={brands} user={user} />;
}
