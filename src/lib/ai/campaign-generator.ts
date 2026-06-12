import { generateObject } from "ai";
import { z } from "zod/v4";
import { campaignModel } from "@/lib/ai/provider";
import { buildCampaignPrompt } from "@/lib/ai/prompts/campaign";
import type { BrandContext } from "@/lib/ai/prompts/campaign";

export const campaignSchema = z.object({
  executiveSummary: z.string().describe("High-level overview of the campaign strategy and expected outcomes"),
  campaignGoals: z.array(z.object({
    goal: z.string(),
    metric: z.string(),
    target: z.string(),
  })).describe("3-5 specific, measurable campaign objectives"),
  targetAudienceAnalysis: z.object({
    primaryAudience: z.object({
      demographics: z.string(),
      psychographics: z.string(),
      painPoints: z.array(z.string()),
      mediaHabits: z.array(z.string()),
    }),
    secondaryAudience: z.object({
      demographics: z.string(),
      psychographics: z.string(),
      painPoints: z.array(z.string()),
      mediaHabits: z.array(z.string()),
    }),
  }).describe("Detailed audience breakdown"),
  brandPositioning: z.string().describe("Brand positioning strategy relative to competitors"),
  offerStrategy: z.object({
    primaryOffer: z.string(),
    secondaryOffers: z.array(z.string()),
    urgencyDrivers: z.array(z.string()),
  }).describe("Value propositions and incentives"),
  messagingFramework: z.object({
    coreMessage: z.string(),
    supportingMessages: z.array(z.string()),
    proofPoints: z.array(z.string()),
  }).describe("Core and supporting messages"),
  contentPillars: z.array(z.object({
    pillar: z.string(),
    description: z.string(),
    contentTypes: z.array(z.string()),
  })).describe("3-5 thematic content pillars"),
  platformStrategy: z.array(z.object({
    platform: z.string(),
    rationale: z.string(),
    tactics: z.array(z.string()),
  })).describe("Platform prioritization and tactics"),
  weeklyContentCalendar: z.array(z.object({
    week: z.string(),
    theme: z.string(),
    contentPieces: z.array(z.object({
      day: z.string(),
      format: z.string(),
      topic: z.string(),
      platform: z.string(),
    })),
  })).describe("Week-by-week content plan"),
  recommendedPosts: z.array(z.object({
    title: z.string(),
    hook: z.string(),
    bodyCopyDirection: z.string(),
    format: z.string(),
    platform: z.string(),
    cta: z.string(),
  })).describe("5-8 specific post concepts"),
  ctaStrategy: z.object({
    awareness: z.array(z.string()),
    consideration: z.array(z.string()),
    conversion: z.array(z.string()),
    retention: z.array(z.string()),
  }).describe("Calls-to-action by funnel stage"),
  kpis: z.array(z.object({
    metric: z.string(),
    benchmark: z.string(),
    measurementTool: z.string(),
  })).describe("Key performance indicators"),
  executionRoadmap: z.array(z.object({
    phase: z.string(),
    timeline: z.string(),
    milestones: z.array(z.string()),
    deliverables: z.array(z.string()),
    resources: z.array(z.string()),
  })).describe("Phased timeline with milestones"),
  riskAndOpportunityAnalysis: z.object({
    risks: z.array(z.object({
      risk: z.string(),
      likelihood: z.string(),
      impact: z.string(),
      mitigation: z.string(),
    })),
    opportunities: z.array(z.object({
      opportunity: z.string(),
      potentialImpact: z.string(),
      actionRequired: z.string(),
    })),
  }).describe("Risks with mitigation and opportunities"),
});

export type CampaignOutput = z.infer<typeof campaignSchema>;

export interface CampaignParams {
  type: string;
  duration: string;
}

export async function generateCampaign(
  brandContext: BrandContext,
  params: CampaignParams,
): Promise<CampaignOutput> {
  const systemPrompt = buildCampaignPrompt(brandContext);

  const { object } = await generateObject({
    model: campaignModel,
    schema: campaignSchema,
    system: systemPrompt,
    prompt: `Generate a ${params.type} campaign plan with a duration of ${params.duration}.`,
  });

  return object;
}
