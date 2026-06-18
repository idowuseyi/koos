# Plan: Phase 3 — AI Content Calendar

**Date:** 2026-06-18
**Goal (design spec §7):** AI calendar generation from an active strategy; 4 views (Month/Week/Day/Agenda) with toggle + date nav; calendar item detail drawer. Leaves the app demoable: Strategy → **Generate Calendar** → browse the plan → (seam) Request Design.

**Verifiable now:** DB (Aiven/local) + Google Gemini both live, so AI generation and persistence are tested for real, not just type-checked.

## Source of truth
- UI spec §2.2 (item fields), §2.3 (views), §5.6 (generation, defaults to **Week** view), §5.7 (item drawer). Principle §3.4: every item must be actionable; §3.2: design-required items are flagged, fulfilled by humans (Phase 4).
- Schema already has `calendars` + `calendar_items` (date, time, platform, contentType, title, brief, designRequired, designType, dimensions, status, sortOrder).

## Key design decisions
- **No date hallucination:** the AI returns `dayOffset` (0-based) per item, not calendar dates. The server computes real dates from a `startDate` = the upcoming Monday. Calendar `startDate`/`endDate` derived server-side.
- **Generation input:** the active strategy's `structured` JSON + brand summary. Target ~14 days.
- **Request Design** button exists in the item drawer but is the **Phase 4 seam** — wired to a disabled/"coming soon" affordance now, replaced by the ticket modal in Phase 4.
- **URL state** (view + focused date) via `nuqs` so views are shareable/back-button friendly.

## Tasks

### 1. Calendar AI schema — `src/lib/ai/calendar-schema.ts` (TDD)
- `calendarItemPlanSchema`: `{ dayOffset:int>=0, time:string, platform:string, contentType:string, title:string, brief:string, designRequired:boolean, designType?:string, dimensions?:string }`.
- `calendarPlanSchema`: `{ items: array(min 1) }`.
- Tests: valid plan parses; rejects negative dayOffset / empty title; optional design fields.

### 2. Schedule helper — `src/lib/calendar/schedule.ts` (TDD)
- `upcomingMonday(from: Date): Date` · `itemDate(start, dayOffset): Date` · `toCalendarRows(plan, start)` → rows with computed `date` + `sortOrder` (by date then time); `endDate` = max date.
- Tests: Monday math across week boundaries; offset→date; sort order; end-date.

### 3. Calendar prompts — `src/lib/ai/prompts/calendar.ts`
- `buildCalendarSystemPrompt(brand)` + `buildCalendarGenerationPrompt(strategy, brand)`. Enforce actionable items (§3.4), realistic cadence from `postingSchedule`, mark design-required with type + dimensions.

### 4. Calendar queries — `src/lib/db/queries/index.ts`
- `createCalendar`, `insertCalendarItems` (bulk), `getActiveCalendarForBrand`, `getCalendarWithItems(calendarId)`, `getCalendarItemById`. Ownership always via brand → user.

### 5. Generate route — `POST /api/calendar/generate`
- Auth → `{ strategyId }` → load strategy + brand, verify `brand.userId === dbUser.id` → `generateObject(calendarPlanSchema, getModel("strategy"))` → `toCalendarRows` → persist calendar + items in a tx → `recordUsageEvent("calendar_generated")` → `{ calendarId }`. AI/DB errors → JSON error (no silent fail).

### 6. Strategy handoff — `strategy-client.tsx`
- `handleGenerateCalendar`: POST the route with the saved `strategyId`; loading state on the button; on success `router.push("/calendar")`; on error show inline error + retry (UI spec §3.6). Replaces the current navigate-only stub.

### 7. Calendar page (server) — `src/app/(dashboard)/calendar/page.tsx`
- `requireBrand()` → `getActiveCalendarForBrand` + items. No calendar → empty state (CTA to `/strategy`). Else render `CalendarClient`.

### 8. Calendar views (client) — acceptance-criteria + contracts
- `calendar-client.tsx` (view + focusedDate via nuqs; default **week**), `view-toggle.tsx`, `month-view.tsx`, `week-view.tsx`, `day-view.tsx`, `agenda-view.tsx`, `calendar-item-card.tsx`.
- Design-required items show a blue dot + "Design Required" (KO blue). Date nav (prev/next/today). Uses existing tokens/components; responsive per spec §11.
- Pure grouping helpers (group-by-day, month-grid weeks) extracted to `src/lib/calendar/group.ts` (TDD).

### 9. Item detail drawer — `calendar-item-drawer.tsx`
- Opens on item click (Sheet on desktop / bottom sheet on mobile). Shows all §5.7 fields. Footer: **Close** (ghost) + **Request Design** (primary). Request Design = Phase 4 seam (disabled w/ "Available soon" or toast). Focus trap + aria per §9.

### 10. Verification + review
- Gates: `tsc`, `vitest`, `biome`. **Live:** generate a calendar from a seeded brand+strategy via Gemini, assert schema-valid + persisted rows + dates correct; `next build` green.
- Two-stage review (spec-compliance + code-quality), fix findings, tag `phase-3-calendar`.

## Out of scope (later phases)
- Design Ticket modal + fulfillment (Phase 4 — the Request Design seam lands there).
- Drag/drop rescheduling, editing items, multi-calendar management, realtime.
