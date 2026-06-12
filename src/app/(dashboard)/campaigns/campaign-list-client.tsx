"use client";

import { useState } from "react";
import Link from "next/link";

interface CampaignData {
  campaign: {
    id: string;
    title: string | null;
    type: "product_campaign" | "service_campaign";
    status: "draft" | "generated" | "exported";
    duration: string;
    createdAt: Date | null;
  };
  brandName: string;
}

function mapType(type: "product_campaign" | "service_campaign") {
  return type === "product_campaign" ? "Product Campaign" : "Service Campaign";
}

function mapStatus(status: "draft" | "generated" | "exported") {
  const map = { draft: "Draft", generated: "Generated", exported: "Exported" } as const;
  return map[status];
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const tabs = ["All", "Product Campaign", "Service Campaign"] as const;
type Tab = (typeof tabs)[number];

export default function CampaignListClient({ campaigns }: { campaigns: CampaignData[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filteredCampaigns =
    activeTab === "All"
      ? campaigns
      : campaigns.filter((c) => mapType(c.campaign.type) === activeTab);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface">
            Campaigns
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            AI-generated marketing campaigns tailored to your brand strategy.
          </p>
        </div>
        <Link
          href="/chat"
          className="gradient-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:ai-glow"
        >
          <span className="material-symbols-outlined text-lg">
            auto_awesome
          </span>
          Generate New Campaign
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
            campaign
          </span>
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-2">
            No campaigns yet
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Generate your first AI-powered marketing campaign to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCampaigns.map(({ campaign, brandName }) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="glass-panel glow-hover p-5 flex flex-col gap-4 transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <span
                  className={`status-pill ${
                    campaign.status === "generated" || campaign.status === "exported"
                      ? "bg-success/10 text-success"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {mapStatus(campaign.status)}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </div>

              {/* Card Body */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-on-surface mb-1">
                  {campaign.title ?? "Untitled Campaign"}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-on-surface-variant">
                    {brandName}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-on-surface-variant" />
                  <span className="status-pill bg-primary/10 text-primary">
                    {mapType(campaign.type)}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">
                  calendar_today
                </span>
                {campaign.duration}-Day Campaign
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
                <span className="text-xs text-on-surface-variant">
                  {formatDate(campaign.createdAt)}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                      download
                    </span>
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                      share
                    </span>
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                      edit
                    </span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
