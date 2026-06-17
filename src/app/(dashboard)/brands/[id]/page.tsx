import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { getAllBrandContexts, getBrandById } from "@/lib/db/queries";

function getStatusPill(status: string) {
  switch (status) {
    case "Active":
      return "bg-success/20 text-success";
    case "In Progress":
      return "bg-primary/20 text-primary";
    case "Draft":
      return "bg-warning/20 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function deriveStatus(onboardingStatus: "draft" | "in_progress" | "completed") {
  switch (onboardingStatus) {
    case "completed":
      return "Active";
    case "in_progress":
      return "In Progress";
    case "draft":
      return "Draft";
  }
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { dbUser } = await getAuthUser();

  if (!dbUser) {
    redirect("/login");
  }

  const brand = await getBrandById(id);

  if (!brand || brand.userId !== dbUser.id) {
    notFound();
  }

  const brandContexts = await getAllBrandContexts(id);
  const contextMap = new Map(brandContexts.map((ctx) => [ctx.section, ctx]));

  type ContextSection = (typeof brandContexts)[number]["section"];
  const hasSection = (section: ContextSection) => {
    const ctx = contextMap.get(section);
    if (!ctx) return false;
    const data = ctx.dataJson as Record<string, unknown> | null;
    return data !== null && Object.keys(data).length > 0;
  };

  const status = deriveStatus(brand.onboardingStatus);
  const isComplete = brand.completionPercentage === 100;
  const avatarLetter = brand.name.charAt(0).toUpperCase();

  // Checklist completion based on actual context sections
  const checklistItems = [
    {
      label: "Account Information",
      complete: hasSection("account_info"),
    },
    {
      label: "Business Overview",
      complete: hasSection("business_overview"),
    },
    {
      label: "Target Audience",
      complete: hasSection("audience"),
    },
    {
      label: "Brand Foundation",
      complete: hasSection("brand_foundation"),
    },
    {
      label: "Products/Services",
      complete: hasSection("products_services"),
    },
    {
      label: "Campaign Setup",
      complete: hasSection("campaign_setup"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: "#138BC8" }}
            >
              {avatarLetter}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-on-surface">
                  {brand.name}
                </h1>
                <span className={`status-pill ${getStatusPill(status)}`}>
                  {status}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">Brand Profile</p>
              <p className="text-xs text-on-surface-variant/60">
                Created{" "}
                {brand.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="space-y-1.5 w-full sm:w-48">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Completion</span>
              <span className="font-medium text-on-surface">
                {brand.completionPercentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${brand.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {!isComplete && (
          <div className="border-t border-outline-variant pt-4">
            <Link
              href={`/brands/new?brandId=${brand.id}`}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground gradient-primary transition-opacity hover:opacity-90"
            >
              <span className="material-symbols-outlined text-sm">
                play_arrow
              </span>
              Continue Onboarding
            </Link>
          </div>
        )}
      </div>

      {isComplete ? (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              menu_book
            </span>
            <h2 className="font-heading text-lg font-semibold text-on-surface">
              Brand Knowledge Base
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant">
            Your brand knowledge base is complete and ready to power AI-driven
            campaigns and content.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-panel-strong p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  person
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Account
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Brand owner details configured
              </p>
            </div>
            <div className="glass-panel-strong p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  business
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Business
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Business overview and positioning set
              </p>
            </div>
            <div className="glass-panel-strong p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  group
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Audience
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Target audience profiles defined
              </p>
            </div>
            <div className="glass-panel-strong p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  diamond
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Foundation
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Mission, vision, and values established
              </p>
            </div>
            <div className="glass-panel-strong p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  palette
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Personality
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Brand voice and personality configured
              </p>
            </div>
            <div className="glass-panel-strong p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  inventory_2
                </span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Products
                </span>
              </div>
              <p className="text-sm text-on-surface">
                Products and services cataloged
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-warning text-xl">
              info
            </span>
            <h2 className="font-heading text-lg font-semibold text-on-surface">
              Onboarding Incomplete
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant">
            Complete the onboarding wizard to unlock your brand knowledge base,
            AI-powered campaigns, and content generation features.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    item.complete
                      ? "text-success"
                      : "text-on-surface-variant/40"
                  }`}
                >
                  {item.complete ? "check_circle" : "radio_button_unchecked"}
                </span>
                <span className="text-sm text-on-surface">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-on-surface">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href={`/brands/new?brandId=${brand.id}`}
            className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              edit
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">Edit Brand</p>
              <p className="text-xs text-on-surface-variant">
                Update brand details
              </p>
            </div>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              dashboard
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">Dashboard</p>
              <p className="text-xs text-on-surface-variant">
                Return to overview
              </p>
            </div>
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              smart_toy
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">AI Chat</p>
              <p className="text-xs text-on-surface-variant">
                Chat with AI strategist
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
