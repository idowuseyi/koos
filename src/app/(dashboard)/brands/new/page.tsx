import Link from "next/link";

export default function NewBrandPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant/40">
        construction
      </span>
      <h1 className="font-heading text-2xl font-bold text-on-surface">
        Brand Onboarding
      </h1>
      <p className="mt-2 max-w-md text-on-surface-variant">
        Brand onboarding is coming soon. Check back after the next update.
      </p>
      <Link
        href="/brands"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Back to Brands
      </Link>
    </div>
  );
}
