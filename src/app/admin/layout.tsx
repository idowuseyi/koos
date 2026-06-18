import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["designer", "admin"]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-background/80 px-6 backdrop-blur-xl">
        <Link
          href="/admin/tickets"
          className="font-display text-lg font-bold text-foreground"
        >
          KO Design Admin
        </Link>
        <Link
          href="/dashboard"
          className="text-[13px] text-[var(--text-secondary)] hover:text-foreground"
        >
          Back to app
        </Link>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
