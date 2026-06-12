"use client";

import { useState } from "react";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  onboardingStatus: string;
  completionPercentage: number;
}

interface ProductService {
  id: string;
  type: string;
  name: string;
  description: string | null;
  price: string | null;
}

interface KnowledgeClientProps {
  brand: Brand;
  contextMap: Record<string, Record<string, unknown>>;
  productsServices: ProductService[];
  readinessScore: number;
  allBrands: Brand[];
}

const sectionConfig = [
  { id: "foundation", icon: "foundation", label: "Foundation", contextKey: "brand_foundation" },
  { id: "audience", icon: "group", label: "Audience", contextKey: "audience" },
  { id: "products", icon: "inventory_2", label: "Products & Services", contextKey: "products_services" },
  { id: "social", icon: "share", label: "Social Media", contextKey: "social_media" },
];

function getStatus(score: number): { label: string; className: string } {
  if (score >= 75) return { label: "Complete", className: "text-success" };
  if (score >= 40) return { label: "Partial", className: "text-warning" };
  if (score > 0) return { label: "Started", className: "text-primary" };
  return { label: "Missing", className: "text-on-surface-variant" };
}

export default function KnowledgeClient({
  brand,
  contextMap,
  productsServices,
  readinessScore,
  allBrands,
}: KnowledgeClientProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    foundation: true,
    audience: false,
    products: false,
    social: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const brandFoundation = contextMap.brand_foundation ?? {};
  const audience = contextMap.audience ?? {};
  const social = contextMap.social_media ?? {};

  const mission = (brandFoundation.mission as string) ?? "";
  const vision = (brandFoundation.vision as string) ?? "";
  const coreValues = (brandFoundation.coreValues as Array<{ title: string; description: string }>) ?? [];
  const personalityTraits = (brandFoundation.personality as string[]) ?? [];

  const primaryAudience = (audience.primaryAudience as string) ?? "";
  const secondaryAudience = (audience.secondaryAudience as string) ?? "";
  const primaryTags = (audience.primaryTags as string[]) ?? [];
  const secondaryTags = (audience.secondaryTags as string[]) ?? [];

  const socialPlatforms = (social.platforms as Array<{ name: string; handle: string; followers: string }>) ?? [];

  const sectionChecks = [
    { label: "Brand Foundation", hasData: !!contextMap.brand_foundation },
    { label: "Audience Data", hasData: !!contextMap.audience },
    { label: "Product Catalog", hasData: productsServices.length > 0 },
    { label: "Competitor Intel", hasData: !!contextMap.business_overview },
  ];

  const traitColors = [
    "text-primary bg-primary/15",
    "text-success bg-success/15",
    "text-secondary bg-secondary/15",
    "text-warning bg-warning/15",
    "text-primary bg-primary/10",
    "text-on-surface-variant bg-surface-container-high",
    "text-secondary bg-secondary/10",
    "text-success bg-success/10",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/brands" className="text-on-surface-variant hover:text-on-surface transition-colors">
            Brands
          </Link>
          <span className="text-on-surface-variant">/</span>
          <span className="text-on-surface">Knowledge Base</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">
                auto_awesome
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-on-surface">
                  {brand.name}
                </h1>
                {/* Brand Switcher */}
                {allBrands.length > 1 && (
                  <select
                    defaultValue={brand.id}
                    onChange={(e) => {
                      window.location.href = `/knowledge/${e.target.value}`;
                    }}
                    className="text-xs bg-transparent border border-outline-variant rounded-lg px-2 py-1 text-on-surface-variant"
                  >
                    {allBrands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-sm text-on-surface-variant">
                Brand Knowledge Base
              </p>
            </div>
            <span className="status-pill bg-success/10 text-success ml-2 text-xs px-3 py-1">
              {readinessScore}% Context Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/brands/${brand.id}`}
              className="glass-panel glow-hover px-4 py-2 text-sm font-medium text-on-surface flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit Brand
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-4">
          {/* Foundation Section */}
          <div className="glass-panel glow-hover overflow-hidden">
            <button
              onClick={() => toggleSection("foundation")}
              className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  foundation
                </span>
                <h2 className="font-heading text-lg font-semibold text-on-surface">
                  Foundation
                </h2>
              </div>
              <span
                className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                  openSections.foundation ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            {openSections.foundation && (
              <div className="px-5 pb-5 space-y-4">
                {mission && (
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Mission
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {mission}
                    </p>
                  </div>
                )}

                {vision && (
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Vision
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {vision}
                    </p>
                  </div>
                )}

                {coreValues.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                      Core Values
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {coreValues.map((value) => (
                        <div
                          key={value.title}
                          className="bg-surface-container-low rounded-lg p-4 border border-outline-variant"
                        >
                          <h4 className="text-sm font-semibold text-on-surface mb-1">
                            {value.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!mission && !vision && coreValues.length === 0 && (
                  <p className="text-sm text-on-surface-variant py-4 text-center">
                    No foundation data yet. Complete brand onboarding to populate this section.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Audience Section */}
          <div className="glass-panel glow-hover overflow-hidden">
            <button
              onClick={() => toggleSection("audience")}
              className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  group
                </span>
                <h2 className="font-heading text-lg font-semibold text-on-surface">
                  Audience
                </h2>
              </div>
              <span
                className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                  openSections.audience ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            {openSections.audience && (
              <div className="px-5 pb-5 space-y-4">
                {primaryAudience && (
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
                    <h3 className="text-sm font-semibold text-on-surface mb-2">
                      Primary Audience
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                      {primaryAudience}
                    </p>
                    {primaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {primaryTags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {secondaryAudience && (
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
                    <h3 className="text-sm font-semibold text-on-surface mb-2">
                      Secondary Audience
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                      {secondaryAudience}
                    </p>
                    {secondaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {secondaryTags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!primaryAudience && !secondaryAudience && (
                  <p className="text-sm text-on-surface-variant py-4 text-center">
                    No audience data yet. Complete the audience section in brand onboarding.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Products & Services Section */}
          <div className="glass-panel glow-hover overflow-hidden">
            <button
              onClick={() => toggleSection("products")}
              className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  inventory_2
                </span>
                <h2 className="font-heading text-lg font-semibold text-on-surface">
                  Products &amp; Services
                </h2>
              </div>
              <span
                className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                  openSections.products ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            {openSections.products && (
              <div className="px-5 pb-5">
                {productsServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productsServices.map((product) => (
                      <div
                        key={product.id}
                        className="bg-surface-container-low rounded-lg p-4 border border-outline-variant flex items-start gap-3"
                      >
                        <span className="material-symbols-outlined text-primary text-2xl">
                          {product.type === "product" ? "inventory_2" : "design_services"}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-on-surface">
                            {product.name}
                          </h4>
                          {product.description && (
                            <p className="text-xs text-on-surface-variant mt-1">
                              {product.description}
                            </p>
                          )}
                          {product.price && (
                            <p className="text-xs text-primary mt-1 font-medium">
                              {product.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant py-4 text-center">
                    No products or services added yet. Add them during brand onboarding.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Social Media Section */}
          <div className="glass-panel glow-hover overflow-hidden">
            <button
              onClick={() => toggleSection("social")}
              className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  share
                </span>
                <h2 className="font-heading text-lg font-semibold text-on-surface">
                  Social Media
                </h2>
              </div>
              <span
                className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                  openSections.social ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            {openSections.social && (
              <div className="px-5 pb-5">
                {socialPlatforms.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {socialPlatforms.map((platform) => (
                      <div
                        key={platform.name}
                        className="bg-surface-container-low rounded-lg p-4 border border-outline-variant flex items-center gap-3 min-w-[200px]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-base">
                            {platform.name === "Instagram"
                              ? "photo_camera"
                              : platform.name === "TikTok"
                                ? "music_note"
                                : platform.name === "LinkedIn"
                                  ? "business"
                                  : platform.name === "X" || platform.name === "Twitter"
                                    ? "tag"
                                    : "play_circle"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-on-surface">
                            {platform.name}
                          </p>
                          {platform.followers && (
                            <p className="text-xs text-on-surface-variant">
                              {platform.followers} followers
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant py-4 text-center">
                    No social media data yet. Complete the social media section in brand onboarding.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Knowledge Health */}
          <div className="glass-panel glow-hover p-5 text-center">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-4">
              Knowledge Health
            </h3>
            <div className="mb-4">
              <span className="font-heading text-5xl font-bold gradient-text">
                {readinessScore}%
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Context Readiness Score
            </p>
            <div className="progress-bar h-2">
              <div
                className="progress-bar-fill ai-glow"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <div className="mt-4 space-y-2 text-left">
              {sectionChecks.map((check) => {
                const status = getStatus(check.hasData ? 100 : 0);
                return (
                  <div key={check.label} className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">{check.label}</span>
                    <span className={`font-semibold ${status.className}`}>
                      {check.hasData ? "Complete" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Personality */}
          {personalityTraits.length > 0 && (
            <div className="glass-panel glow-hover p-5">
              <h3 className="font-heading text-base font-semibold text-on-surface mb-4">
                Brand Personality
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {personalityTraits.map((trait, i) => (
                  <span
                    key={trait}
                    className={`px-3 py-1.5 rounded-full font-medium text-base ${traitColors[i % traitColors.length]}`}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
