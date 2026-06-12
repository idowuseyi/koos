export interface BrandContext {
  brandProfile: string;
  audienceData: string;
  productsServices: string;
  messaging: string;
  brandVoice: string;
}

export function buildCampaignPrompt(context: BrandContext): string {
  return `You are an expert marketing strategist. Generate a comprehensive marketing campaign plan based on the following brand context.

BRAND PROFILE:
${context.brandProfile}

AUDIENCE DATA:
${context.audienceData}

PRODUCTS & SERVICES:
${context.productsServices}

EXISTING MESSAGING:
${context.messaging}

BRAND VOICE & TONE:
${context.brandVoice}

Using the brand context above, generate a complete marketing campaign plan. Your response must include all 14 sections below with substantive, actionable content specific to this brand:

1. EXECUTIVE SUMMARY - High-level overview of the campaign strategy, core thesis, and expected outcomes.

2. CAMPAIGN GOALS - 3-5 specific, measurable objectives the campaign aims to achieve.

3. TARGET AUDIENCE ANALYSIS - Detailed breakdown of the primary and secondary audiences, their demographics, psychographics, pain points, and media consumption habits.

4. BRAND POSITIONING - How this campaign positions the brand relative to competitors and in the minds of the target audience.

5. OFFER STRATEGY - The specific value propositions, promotions, or incentives that will drive action.

6. MESSAGING FRAMEWORK - Core message, supporting messages, and proof points that align with the brand voice.

7. CONTENT PILLARS - 3-5 thematic content pillars that organize all campaign content around key brand narratives.

8. PLATFORM STRATEGY - Which platforms to prioritize and why, with platform-specific tactics.

9. WEEKLY CONTENT CALENDAR - A structured week-by-week content plan covering the full campaign duration.

10. RECOMMENDED POSTS - 5-8 specific post concepts with hooks, body copy direction, and format recommendations.

11. CTA STRATEGY - Primary and secondary calls-to-action mapped to each stage of the customer journey.

12. KPIS - Key performance indicators and benchmarks for measuring campaign success.

13. EXECUTION ROADMAP - Phased timeline with milestones, deliverables, and resource requirements.

14. RISK & OPPORTUNITY ANALYSIS - Potential risks with mitigation strategies, and emerging opportunities to leverage.

Be specific to this brand. Use data-driven reasoning. Avoid generic advice. Every section should reference the brand's actual products, audience, and positioning.`;
}
