"use client";

import { useState } from "react";
import Link from "next/link";

interface CampaignData {
  id: string;
  brandId: string;
  type: "product_campaign" | "service_campaign";
  duration: string;
  generatedPlan: Record<string, unknown> | null;
  title: string | null;
  status: "draft" | "generated" | "exported";
  createdAt: Date | null;
  updatedAt: Date | null;
}

type Tab = "Strategy" | "Content Calendar" | "Content Pillars" | "Execution Roadmap";
const tabs: Tab[] = ["Strategy", "Content Calendar", "Content Pillars", "Execution Roadmap"];

function mapType(type: "product_campaign" | "service_campaign") {
  return type === "product_campaign" ? "Product Campaign" : "Service Campaign";
}

function mapStatus(status: "draft" | "generated" | "exported") {
  const map = { draft: "Draft", generated: "Generated", exported: "Exported" } as const;
  return map[status];
}

export default function CampaignDetailClient({
  campaign,
  brandName,
}: {
  campaign: CampaignData;
  brandName: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Strategy");

  const plan = campaign.generatedPlan as Record<string, unknown> | null;

  const executiveSummary = (plan?.executiveSummary as string) ?? "";
  const objectives = (plan?.objectives as string[]) ?? [];
  const primaryAudience = plan?.primaryAudience as { name?: string; description?: string; channels?: string } | undefined;
  const secondaryAudience = plan?.secondaryAudience as { name?: string; description?: string; channels?: string } | undefined;
  const messagingFramework = (plan?.messagingFramework as { title?: string; description?: string; tone?: string; icon?: string }[]) ?? [];
  const aiNote = (plan?.aiNote as string) ?? "";
  const objective = (plan?.objective as string) ?? "";
  const regions = (plan?.regions as string) ?? "";
  const generationProgress = (plan?.generationProgress as number) ?? (campaign.status === "generated" ? 100 : 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* Top Bar */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/campaigns"
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Campaigns
          </Link>
          <span className="text-on-surface-variant">/</span>
          <span className="text-on-surface">{campaign.title ?? "Untitled Campaign"}</span>
        </div>

        {/* Status + Type */}
        <div className="flex items-center gap-3">
          <span className={`status-pill ${
            campaign.status === "generated" || campaign.status === "exported"
              ? "bg-success/10 text-success"
              : "bg-surface-container-high text-on-surface-variant"
          }`}>
            {mapStatus(campaign.status)}
          </span>
          <span className="text-xs text-on-surface-variant">
            {mapType(campaign.type)}
          </span>
        </div>

        {/* Title + Description */}
        <div>
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-on-surface">
            {campaign.title ?? "Untitled Campaign"}
          </h1>
          {plan?.description ? (
            <p className="text-sm text-on-surface-variant mt-2 max-w-3xl leading-relaxed">
              {String(plan.description)}
            </p>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="glass-panel glow-hover px-4 py-2.5 text-sm font-medium text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-base">link</span>
            Share Link
          </button>
          <button className="glass-panel glow-hover px-4 py-2.5 text-sm font-medium text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Export
          </button>
          <button className="gradient-primary px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 hover:ai-glow transition-all">
            <span className="material-symbols-outlined text-base">
              auto_awesome
            </span>
            Edit with AI
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-outline-variant">
        <div className="flex items-center gap-6 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Strategy" && (
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Executive Summary */}
            <div className="glass-panel glow-hover p-5 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">
                  summarize
                </span>
                <h3 className="font-heading text-base font-semibold text-on-surface">
                  Executive Summary
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                {executiveSummary || "No executive summary generated yet."}
              </p>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-on-surface-variant">
                    Strategy Generation
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {generationProgress}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${generationProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="glass-panel glow-hover p-5 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">
                  flag
                </span>
                <h3 className="font-heading text-base font-semibold text-on-surface">
                  Objectives
                </h3>
              </div>
              {objectives.length > 0 ? (
                <ul className="space-y-3">
                  {objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-success text-base mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-on-surface-variant leading-relaxed">
                        {obj}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-on-surface-variant">No objectives defined yet.</p>
              )}
            </div>

            {/* Target Audience */}
            <div className="glass-panel glow-hover p-5 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">
                  group
                </span>
                <h3 className="font-heading text-base font-semibold text-on-surface">
                  Target Audience
                </h3>
              </div>
              <div className="space-y-4">
                {primaryAudience && (
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-on-surface mb-1">
                      {primaryAudience.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                      {primaryAudience.description}
                    </p>
                    {primaryAudience.channels && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <span className="material-symbols-outlined text-sm">
                          send
                        </span>
                        {primaryAudience.channels}
                      </div>
                    )}
                  </div>
                )}
                {secondaryAudience && (
                  <div className="border-l-2 border-secondary pl-3">
                    <h4 className="text-sm font-semibold text-on-surface mb-1">
                      {secondaryAudience.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                      {secondaryAudience.description}
                    </p>
                    {secondaryAudience.channels && (
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <span className="material-symbols-outlined text-sm">
                          send
                        </span>
                        {secondaryAudience.channels}
                      </div>
                    )}
                  </div>
                )}
                {!primaryAudience && !secondaryAudience && (
                  <p className="text-xs text-on-surface-variant">No audience data generated yet.</p>
                )}
              </div>
            </div>

            {/* Messaging Framework */}
            <div className="glass-panel glow-hover p-5 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">
                  forum
                </span>
                <h3 className="font-heading text-base font-semibold text-on-surface">
                  Messaging Framework
                </h3>
              </div>
              {messagingFramework.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {messagingFramework.map((msg, i) => (
                    <div
                      key={i}
                      className="bg-surface-container-low rounded-lg p-4 border border-outline-variant"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          {msg.icon ?? "chat"}
                        </span>
                        <h4 className="text-sm font-semibold text-on-surface">
                          {msg.title}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                        {msg.description}
                      </p>
                      {msg.tone && (
                        <span className="status-pill bg-primary/10 text-primary">
                          {msg.tone}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant">No messaging framework generated yet.</p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-4">
            {/* Campaign Details */}
            <div className="glass-panel glow-hover p-5">
              <h3 className="font-heading text-base font-semibold text-on-surface mb-4">
                Campaign Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Brand</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xs">
                        eco
                      </span>
                    </div>
                    <span className="text-sm font-medium text-on-surface">
                      {brandName}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-outline-variant" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">
                    Duration
                  </span>
                  <span className="text-sm text-on-surface">
                    {campaign.duration}-Day Campaign
                  </span>
                </div>
                {objective && (
                  <>
                    <div className="h-px bg-outline-variant" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Objective
                      </span>
                      <span className="text-sm text-on-surface">
                        {objective}
                      </span>
                    </div>
                  </>
                )}
                {regions && (
                  <>
                    <div className="h-px bg-outline-variant" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Regions
                      </span>
                      <span className="text-sm text-on-surface">
                        {regions}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AI Strategist Note */}
            {aiNote && (
              <div className="rounded-xl p-5 gradient-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-white text-xl">
                      psychology
                    </span>
                    <h3 className="font-heading text-base font-semibold text-white">
                      AI Strategist Note
                    </h3>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed italic">
                    &ldquo;{aiNote}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "Content Calendar" && (
        <div className="glass-panel glow-hover p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
            calendar_month
          </span>
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-2">
            Content Calendar
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Your AI-generated content calendar with daily posting schedules,
            content themes, and platform-specific recommendations will appear
            here once the campaign strategy is finalized.
          </p>
        </div>
      )}

      {activeTab === "Content Pillars" && (
        <div className="glass-panel glow-hover p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
            view_column
          </span>
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-2">
            Content Pillars
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Detailed breakdown of content pillars with topic clusters, keyword
            strategies, and content format recommendations for each pillar.
          </p>
        </div>
      )}

      {activeTab === "Execution Roadmap" && (
        <div className="glass-panel glow-hover p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
            timeline
          </span>
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-2">
            Execution Roadmap
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Week-by-week execution plan with milestones, deliverables, team
            assignments, and budget allocation across all campaign phases.
          </p>
        </div>
      )}
    </div>
  );
}
