import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { getCampaignsByUserId } from "@/lib/db/queries";
import CampaignListClient from "./campaign-list-client";

export default async function CampaignsPage() {
  const { dbUser } = await getAuthUser();

  if (!dbUser) {
    redirect("/login");
  }

  const campaigns = await getCampaignsByUserId(dbUser.id);

  return <CampaignListClient campaigns={campaigns} />;
}
