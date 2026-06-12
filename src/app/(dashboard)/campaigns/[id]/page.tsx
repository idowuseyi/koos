import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { getCampaignById } from "@/lib/db/queries";
import CampaignDetailClient from "./campaign-detail-client";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { dbUser } = await getAuthUser();

  if (!dbUser) {
    redirect("/login");
  }

  const result = await getCampaignById(id);

  if (!result) {
    notFound();
  }

  const campaign = {
    ...result.campaign,
    generatedPlan: (result.campaign.generatedPlan ?? null) as Record<string, unknown> | null,
  };

  return (
    <CampaignDetailClient
      campaign={campaign}
      brandName={result.brandName}
    />
  );
}
