import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { getBrandsByUserId } from "@/lib/db/queries";

export default async function KnowledgeIndexPage() {
  const { dbUser } = await getAuthUser();
  if (!dbUser) redirect("/login");

  const brands = await getBrandsByUserId(dbUser.id);

  if (brands.length === 0) {
    redirect("/brands/new");
  }

  redirect(`/knowledge/${brands[0].id}`);
}
