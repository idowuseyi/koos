"use client";

import {
  Loader2Icon,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV } from "@/lib/nav";
import { LogoutForm } from "./logout-form";
import { useSidebarCollapse } from "./sidebar-context";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export function AppSidebar({ user }: { user: UserInfo }) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarCollapse();
  const initials = (user.firstName[0] ?? "") + (user.lastName[0] ?? "");

  // Shared link styling — labels hide and icons center when collapsed.
  const rowBase =
    "relative flex items-center gap-3 rounded-lg py-2.5 text-[13px] font-medium transition-colors";
  const rowPad = collapsed ? "justify-center px-0" : "px-4";
  const rowIdle =
    "text-[var(--nav-text)] hover:bg-[var(--nav-hover)] hover:text-[var(--nav-text-active)]";

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--nav-border)] bg-nav transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Logo Area */}
      <div
        className={`flex items-center gap-3 py-6 ${
          collapsed ? "justify-center px-0" : "px-6"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#0a6d9e] text-sm font-bold text-white">
          KO
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--nav-text-active)]">
              KO OS
            </h1>
            <p className="text-xs text-[var(--nav-text)]">Brand Brain</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div
        className={`pb-2 ${collapsed ? "flex justify-center px-0" : "px-3"}`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center rounded-lg p-2 text-[var(--nav-text)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-text-active)]"
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {MAIN_NAV.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.title : undefined}
              className={`${rowBase} ${rowPad} ${
                isActive
                  ? "text-[var(--nav-text-active)] before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                  : rowIdle
              }`}
            >
              <Icon size={20} strokeWidth={1.75} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--nav-border)] px-3 py-3">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`${rowBase} ${rowPad} ${rowIdle}`}
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <LogoutForm>
          {(pending) => (
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              title={collapsed ? "Logout" : undefined}
              className={`${rowBase} ${rowPad} w-full ${rowIdle} disabled:opacity-60`}
            >
              {pending ? (
                <Loader2Icon size={20} className="animate-spin" />
              ) : (
                <LogOut size={20} />
              )}
              {!collapsed && <span>{pending ? "Logging out…" : "Logout"}</span>}
            </button>
          )}
        </LogoutForm>
      </div>

      {/* User Avatar */}
      <div className="border-t border-[var(--nav-border)] px-4 py-4">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 truncate">
              <p className="truncate text-sm font-medium text-[var(--nav-text-active)]">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-[var(--nav-text)]">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
