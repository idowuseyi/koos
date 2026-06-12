import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { getBrandsByUserId } from "@/lib/db/queries";

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

function deriveStatus(
  onboardingStatus: "draft" | "in_progress" | "completed"
) {
  switch (onboardingStatus) {
    case "completed":
      return "Active";
    case "in_progress":
      return "In Progress";
    case "draft":
      return "Draft";
  }
}

export default async function BrandsPage() {
  const { dbUser } = await getAuthUser();

  if (!dbUser) {
    redirect("/login");
  }

  const brands = await getBrandsByUserId(dbUser.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface">
            Your Brands
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage your brand profiles and identities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => {
          const status = deriveStatus(brand.onboardingStatus);
          const avatarLetter = brand.name.charAt(0).toUpperCase();

          return (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="glass-panel glow-hover p-5 space-y-4 block transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: "#138BC8" }}
                >
                  {avatarLetter}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-semibold text-on-surface truncate">
                      {brand.name}
                    </h3>
                    <span className={`status-pill ${getStatusPill(status)}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Brand Profile
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
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

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>
                  Created{" "}
                  {brand.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="material-symbols-outlined text-base text-on-surface-variant">
                  chevron_right
                </span>
              </div>
            </Link>
          );
        })}

        <Link
          href="/brands/new"
          className="glass-panel glow-hover flex flex-col items-center justify-center gap-3 p-5 border-dashed border-2 border-outline-variant transition-all min-h-[180px]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-primary/40 text-primary">
            <span className="material-symbols-outlined text-2xl">add</span>
          </div>
          <div className="text-center">
            <p className="font-heading text-sm font-semibold text-primary">
              Create New Brand
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Start a new brand profile
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
