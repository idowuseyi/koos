"use server";

import { revalidatePath } from "next/cache";
import {
  createBrand,
  getAllBrandContexts,
  getBrandById,
  updateBrand,
  upsertBrandContext,
} from "@/lib/db/queries";
import type { brandContextSectionEnum } from "@/lib/db/schema";

type BrandContextSection = (typeof brandContextSectionEnum.enumValues)[number];

// ── Create Brand Draft ────────────────────────────────────────────────

export async function createBrandDraft(userId: string, name: string) {
  const brand = await createBrand({
    userId,
    name,
    onboardingStatus: "in_progress",
    completionPercentage: 0,
  });
  return brand;
}

// ── Save Brand Progress (per section) ─────────────────────────────────

export async function saveBrandProgress(
  brandId: string,
  data: {
    section: BrandContextSection;
    dataJson: Record<string, unknown>;
    completionPercentage: number;
  },
) {
  const { section, dataJson, completionPercentage } = data;

  await Promise.all([
    upsertBrandContext(brandId, section, dataJson),
    updateBrand(brandId, { completionPercentage }),
  ]);

  const brand = await getBrandById(brandId);
  return brand;
}

// ── Submit Brand Onboarding (final) ───────────────────────────────────

export async function submitBrandOnboarding(
  brandId: string,
  data: {
    sections: Array<{
      section: BrandContextSection;
      dataJson: Record<string, unknown>;
    }>;
  },
) {
  const { sections } = data;

  // Upsert all context sections
  await Promise.all(
    sections.map((s) => upsertBrandContext(brandId, s.section, s.dataJson)),
  );

  // Mark onboarding as completed
  const brand = await updateBrand(brandId, {
    onboardingStatus: "completed",
    completionPercentage: 100,
  });

  revalidatePath("/brands");
  revalidatePath("/dashboard");

  return brand;
}

// ── Get Brand for Onboarding (resume) ─────────────────────────────────

export async function getBrandForOnboarding(brandId: string) {
  const [brand, contexts] = await Promise.all([
    getBrandById(brandId),
    getAllBrandContexts(brandId),
  ]);

  if (!brand) {
    return null;
  }

  return {
    brand,
    contexts,
  };
}
