# SPEC 03 — Apple-style desktop redesign: split layout & motion

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-07-13
> **Objective:** Redesign the app's visual layout and motion into an Apple-inspired, two-column desktop experience (sticky profile/progress sidebar + task list) that uses full display width on desktop and collapses to a single column on mobile, with a handful of new signature animations.

## Scope

**In:**

- Two-column desktop layout (≥1024px, Tailwind `lg`): left sidebar (~50% width, proportional, equal weight with the task column) holds `ProfileHeader` (name/date/quote, larger type scale) + `ProgressBar`, sticky while right column (task list, add-task form, reset button) scrolls independently.
- Below `lg`: single column, stacked — sidebar content (name/date/quote/progress) first, then add-task form, task list, reset button — same order as today.
- Overall page capped at a max-width (e.g. `max-w-6xl`/`7xl`), centered — no edge-to-edge stretch on ultra-wide monitors.
- New signature animations (added to existing checkbox pop):
  - Task enter/exit — new task fades/slides in; deleted task animates out before leaving the list, via `framer-motion`'s `AnimatePresence`.
  - Sidebar entrance — subtle fade+slide on initial load; quote text cross-fades when it changes (bucket change).
  - Modal open/close — `ConfirmModal`/`NameModal` get a scale+fade transition via `framer-motion`.
  - Progress bar fill — refine existing `transition-all duration-500` to match the new motion language, no behavioral change.
- New dependency: `framer-motion` (overrides CLAUDE.md's "no extra deps the platform already provides" for this one case — needed for exit animations, which plain CSS can't do cleanly on unmount).
- Update `CLAUDE.md`'s "Design language" motion paragraph to reflect the expanded (still restrained) animation set.
- Restyle existing atoms/molecules/organisms (`Button`, `TaskItem`, `AddTaskForm`, `TaskList`, `ProfileHeader`, `ProgressBar`, `ConfirmModal`, `NameModal`) for the Apple-vibe direction — spacing, typography scale, shadows/borders — using the `frontend-design` skill during `/spec-impl`.

**Out of scope (for future specs):**

- Any new feature/data (categories, drag-reorder, streaks, multi-profile, etc.) — pure visual/layout/motion spec.
- Dark mode / theme switching.
- Collapsible/hideable sidebar toggle (sidebar is always visible, just reflows on mobile).
- Custom breakpoint values beyond Tailwind's `lg` (1024px) default.
- Persisting any layout preference (e.g. remembering sidebar width) — layout is static per breakpoint, not user-configurable.

## Data model

No new data structures. Purely visual/layout/motion — `Task`, `Profile`, `ProgressBucket` types unchanged.

## Implementation plan

1. Install dependency: `pnpm add framer-motion`.
2. Update `CLAUDE.md`'s "Design language" section: replace the "one signature interaction" line with language covering the expanded set (checkbox pop, task enter/exit, sidebar entrance, modal transitions), still framed as intentional/minimal — not a free-for-all.
3. Restructure `src/features/tasks/TasksPage.tsx` into a responsive two-column grid: a `<aside>` (sidebar: `ProfileHeader` + `ProgressBar`, `sticky top-*` on `lg:`, ~50% width) and a `<main>` (add-task form, task list, reset button, ~50% width). Below `lg`, both stack full-width in the current order (sidebar content, then main content).
4. Wrap the outer page container with a max-width cap (e.g. `max-w-6xl`/`7xl`), centered, replacing the current `max-w-md`.
5. Add sidebar entrance animation in `ProfileHeader.tsx`: wrap in a `framer-motion` `motion.div` (fade+slide on mount); cross-fade the quote text on bucket change using `AnimatePresence` keyed by quote string.
6. Add task enter/exit animation in `TaskList.tsx`: wrap the mapped list in `AnimatePresence`, each `TaskItem` as a `motion.li`/`motion.div` with initial/animate/exit variants (fade + height collapse).
7. Add modal transition in `ConfirmModal.tsx` and `NameModal.tsx`: wrap the modal content in `AnimatePresence` + `motion.div` (scale+fade in/out), replacing whatever open/close behavior exists today.
8. Refine `ProgressBar.tsx`'s fill transition easing/duration if needed to match the new motion language (likely minimal change — already has `transition-all duration-500`).
9. Restyle atoms/molecules/organisms for the Apple-vibe direction (spacing, type scale, borders/shadows) per `frontend-design` skill guidance — pass through `Button`, `TaskItem`, `AddTaskForm`, `IconButton`, `Text`.
10. Manual responsive pass: verify layout at mobile (<640px), tablet (~768–1023px), desktop (≥1024px), and an ultra-wide viewport (≥1728px) — sidebar stickiness, max-width cap, stacking order.
11. Manual pass through all acceptance criteria; verify `prefers-reduced-motion` disables/reduces the new animations same as the existing checkbox pop.

## Acceptance criteria

- [ ] The app loads with no console errors.
- [ ] At viewport widths ≥1024px, the layout shows two columns: sidebar (name/date/quote/progress bar) on the left, task list + add-task form + reset button on the right.
- [ ] The sidebar stays pinned (sticky) in the viewport while the task list scrolls, on desktop widths.
- [ ] At viewport widths <1024px, the layout stacks into a single column in this order: name/date/quote/progress bar, then add-task form, then task list, then reset button.
- [ ] On an ultra-wide viewport (≥1728px), the page content stays capped at a max-width and is centered, not stretched edge-to-edge.
- [ ] Adding a new task animates it into the list (not an instant appearance).
- [ ] Deleting a task (after confirming) animates it out of the list before it's removed.
- [ ] The sidebar's greeting/quote block animates in on initial page load.
- [ ] Changing progress bucket (e.g. completing the last task) cross-fades the quote text rather than swapping it instantly.
- [ ] Opening/closing `ConfirmModal` and `NameModal` shows a scale+fade transition rather than an instant appear/disappear.
- [ ] All existing SPEC 01 and SPEC 02 acceptance criteria still pass (add/toggle/delete/reset tasks, onboarding, name edit, inline task edit, persistence).
- [ ] With `prefers-reduced-motion: reduce` enabled, animations are removed or reduced to instant/near-instant transitions, consistent with the existing checkbox pop behavior.

## Decisions

- **Yes:** pure visual/layout/motion scope, no new features bundled in. User confirmed after being asked; keeps this spec focused and reviewable on its own.
- **Yes:** two-column desktop layout, sidebar (profile/quote/progress) left, tasks right — chosen over a right-sidebar or non-split wide-centered layout.
- **Yes:** `lg` (1024px) as the split breakpoint — standard Tailwind cutoff, avoids a custom value.
- **Yes:** sidebar is sticky on desktop — keeps progress visible while scrolling a long task list.
- **Yes:** sidebar width is proportional (~50%, equal weight with the task column) rather than a fixed pixel column or the originally-planned ~30% — revised during `/spec-impl` step 10 review: user found the initial ~30% column too cramped for the profile/quote/progress block and wanted an Apple-style large info panel with bigger type, not a narrow strip.
- **Yes:** page content capped at a max-width on desktop, centered — avoids an absurdly long task-list line length on large monitors; matches typical Apple-app conventions of not going edge-to-edge on ultra-wide displays.
- **Yes:** mobile (<1024px) stacking order matches today's top-to-bottom order (profile/quote/progress, then actions/list) — no reflow surprises relative to the current app.
- **Yes:** add-task input and Reset all button stay in the main/task column, not moved into the sidebar — sidebar is read-only info + progress, main column stays the action surface.
- **Yes:** expand the motion language beyond the current "one signature interaction" rule, and update `CLAUDE.md` to reflect it — user explicitly asked for more animation; the rule needs to reflect reality rather than being silently violated.
- **Yes:** add `framer-motion` as a new dependency, despite CLAUDE.md's "no extra deps the platform already provides" guidance — explicitly discussed and overridden because clean unmount/exit animations aren't practical with CSS-only transitions (the DOM node needs to animate before leaving the array, which framer-motion's `AnimatePresence` handles natively).
- **No:** collapsible sidebar toggle — out of scope, adds interaction complexity not requested.
- **No:** custom breakpoints beyond `lg` — standard Tailwind scale is sufficient, no design rationale surfaced for a custom value.
- **Quick definition:** remaining implementation-plan/acceptance-criteria/decisions/risks sections were drafted directly from the confirmed scope without an additional per-section confirmation round — user asked to move straight to saving the spec after scope was set.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| `framer-motion` bundle size / new dependency surface | Scoped usage: only `AnimatePresence` + `motion.div`/`motion.li` in the handful of places listed in the implementation plan, not adopted app-wide as a layout primitive. |
| Sticky sidebar overlapping content or breaking on short viewports | Manual responsive pass (step 10) across mobile/tablet/desktop/ultra-wide before marking done. |
| New animations ignoring `prefers-reduced-motion`, hurting accessibility | Explicit acceptance criterion + manual check with the OS-level reduced-motion setting enabled, same pattern as the existing checkbox pop. |
| Restyle regressions breaking SPEC 01/02 functionality (delete/reset/edit flows) | Existing acceptance criteria from both prior specs are re-verified as part of this spec's acceptance criteria. |

## What is **not** in this spec

- Any new feature/data (categories, drag-reorder, streaks, multi-profile, etc.).
- Dark mode / theme switching.
- Collapsible/hideable sidebar toggle.
- Custom breakpoints beyond Tailwind's `lg`.
- Persisting layout preferences.

Each of these, if needed, goes in its own spec.
