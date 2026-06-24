"use client";

import { Store } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "./app-sidebar";
import { SidebarCollapseProvider, useSidebarCollapse } from "./sidebar-context";
import { TopHeader } from "./top-header";

interface ShellUser {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  return (
    <SidebarCollapseProvider>
      <ShellInner user={user}>{children}</ShellInner>
    </SidebarCollapseProvider>
  );
}

function ShellInner({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebarCollapse();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar user={user} />
      <div
        className={`flex min-h-screen flex-1 flex-col transition-[margin-left] duration-200 ${
          collapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >
        <TopHeader user={user}>
          <Link
            href="/brand/create"
            className="flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Store size={16} />
            Create Brand
          </Link>
        </TopHeader>
        <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
