"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "koos_sidebar_collapsed";

interface SidebarCollapseValue {
  /** Desktop-only: sidebar shrunk to an icon rail (md+). */
  collapsed: boolean;
  toggle: () => void;
  /** Mobile-only: off-canvas drawer is open. */
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarCollapseContext = createContext<SidebarCollapseValue | null>(null);

/**
 * Shares sidebar state between the sidebar and the main content wrapper
 * (siblings). `collapsed` is the persisted desktop icon-rail preference;
 * `mobileOpen` is the transient off-canvas drawer state for small screens.
 */
export function SidebarCollapseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hydrate after mount to avoid an SSR/client mismatch.
  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === "true") {
      setCollapsed(true);
    }
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // These callbacks are stabilised with useCallback because consumers list them
  // in effect dependency arrays (e.g. AppSidebar closes the drawer on route
  // change via `[pathname, closeMobile]`). A fresh identity each render would
  // make that effect fire on every render and slam the just-opened drawer shut.
  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const value = useMemo(
    () => ({ collapsed, toggle, mobileOpen, openMobile, closeMobile }),
    [collapsed, toggle, mobileOpen, openMobile, closeMobile],
  );

  return (
    <SidebarCollapseContext.Provider value={value}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse(): SidebarCollapseValue {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) {
    throw new Error(
      "useSidebarCollapse must be used within a SidebarCollapseProvider",
    );
  }
  return ctx;
}
