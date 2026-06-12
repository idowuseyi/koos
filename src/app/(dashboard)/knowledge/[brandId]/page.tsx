import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import {
  getBrandById,
  getBrandsByUserId,
  getAllBrandContexts,
  getProductsServicesByBrandId,
} from "@/lib/db/queries";
import KnowledgeClient from "./knowledge-client";

export default async function KnowledgeBrandPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;
  const { dbUser } = await getAuthUser();
  if (!dbUser) notFound();

  const brand = await getBrandById(brandId);
  if (!brand || brand.userId !== dbUser.id) notFound();

  const [contexts, productsServices, allBrands] = await Promise.all([
    getAllBrandContexts(brandId),
    getProductsServicesByBrandId(brandId),
    getBrandsByUserId(dbUser.id),
  ]);

  const contextMap: Record<string, Record<string, unknown>> = {};
  for (const ctx of contexts) {
    contextMap[ctx.section] = ctx.dataJson as Record<string, unknown>;
  }

  const completedSections = contexts.length;
  const totalSections = 8;
  const readinessScore = Math.round((completedSections / totalSections) * 100);

  return (
    <KnowledgeClient
      brand={brand}
      contextMap={contextMap}
      productsServices={productsServices}
      readinessScore={readinessScore}
      allBrands={allBrands}
    />
  );
}
