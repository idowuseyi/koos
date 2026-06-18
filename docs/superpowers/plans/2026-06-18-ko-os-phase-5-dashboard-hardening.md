# Plan: Phase 5 — Dashboard overview + hardening

**Date:** 2026-06-18
**Goal (design spec §7):** The final phase — a real dashboard overview, plus a cross-cutting hardening pass (responsive, WCAG AA, focus/reduced-motion, consistent error/empty/loading states). No new core features; this makes the MVP launch-ready and cohesive.

## Findings driving this phase
- `/dashboard` is leftover scaffold on a **different design system** (`material-symbols-outlined` — a font that is NOT loaded, so icon names render as literal text — plus `glass-panel`/`on-surface-variant`/`font-heading`). It doesn't match the KO tokens (`--surface-1`, `--text-secondary`, `font-display`, lucide icons) used everywhere else. **Rebuild it.**
- Most flows already have loading/error/empty states (strategy build, calendar generate, calendar/tickets empty). The hardening pass audits the rest and fills gaps; adds app-level error/not-found boundaries.

## Tasks

### 1. Dashboard overview — rebuild `/dashboard` (KO design system)
- Server page via `requireBrand()`; compose a summary from existing queries (no new core features): brand(s), active strategy (`getStrategiesByBrand`), active calendar + items (`getActiveCalendarForBrand`/`getCalendarItems`), design tickets (`getDesignTicketsByUser`).
- Layout (lucide icons + KO tokens + existing `Card`/`StatusBadge`/`TicketStatusBadge`):
  - **Stat cards**: brands, calendar items (next 7 days), open design tickets, delivered tickets.
  - **Recent design tickets** (top ~5) with `TicketStatusBadge`, linking to `/design-request/[id]`.
  - **Upcoming calendar items** (next few) linking to `/calendar`.
  - **Quick actions / continue** (Strategy, Calendar, Brand) — route to last meaningful workspace.
  - Real **empty states** for a brand-new user (no strategy/calendar/tickets yet) with CTAs.
- Pure summary helpers (counts, "next 7 days" filter, recency sort) in `src/lib/dashboard/summary.ts` (TDD). Remove the dead Material/`Icon` code from the page.

### 2. App-level error & not-found boundaries
- `src/app/(dashboard)/error.tsx` (client) — friendly error + "Try again" (`reset()`); `src/app/(dashboard)/not-found.tsx`; a root `src/app/global-error.tsx` if missing. No infinite spinners (UI spec §3.6).
- Add `loading.tsx` where a server page does meaningful async (dashboard, calendar, design-request) for instant skeletons.

### 3. Empty/error-state audit (fill gaps only)
- Sweep the main routes; ensure every async/fetch path has loading + error + empty handling and AI/network errors surface a message + retry. Fix any gaps found (don't rewrite working ones).

### 4. Accessibility pass (WCAG AA, spec §9/§12)
- Icon-only buttons have `aria-label`; visible focus rings (KO-blue) on interactive elements; modals/drawers trap + restore focus (verify base-ui does); `aria-live` for toasts/AI streaming/status; `prefers-reduced-motion` respected (global rule exists — verify it covers new motion). Body text ≥14px; 44px tap targets on mobile nav.

### 5. Responsive QA (spec §11)
- Sidebar → drawer/collapse on mobile; dashboard + calendar + admin grids stack; no horizontal scroll ≤480px; max-width container on desktop. Fix issues found.

### 6. Verify + review + tag
- Gates: tsc, vitest, biome. Live: dashboard renders a real summary for a seeded user (counts correct). `next build` green. Two-stage review, fix findings, tag `phase-5-dashboard`.

## Out of scope
- Analytics/performance tracking (deferred per spec), marketing site, billing, realtime. New AI features.
