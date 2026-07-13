# SPEC 02 — User personalization: name, date, motivational phrase

> **Status:** Implemented
> **Depends on:** SPEC 01
> **Date:** 2026-07-13
> **Objective:** Personalize the app with the user's name (asked once, editable later), today's date, and a motivational phrase that reflects daily progress, sourced from a local quote list, plus inline task editing.

## Scope

**In:**

- Onboarding: on first visit (no saved name), a skippable modal asks for the user's name.
- If skipped, greeting falls back to a generic form ("Hi there").
- Name is editable later via a pencil icon next to the displayed name.
- Name persisted in `localStorage` (new key), validated with `valibot` on load.
- Today's date displayed in "Today, July 13" format.
- Motivational phrase, picked from a local static list of 40 quotes (`data/quotes.json`), selected by progress bucket (0% / in-progress / 100% completed).
- Phrase is fetched through a `fetchQuoteOfTheDay()`-style async function that simulates an API call (returns a `Promise`, reads local JSON internally) — swappable for a real API later without changing call sites.
- Phrase re-picks live whenever the progress bucket changes (e.g. finishing the last task flips it instantly).
- Swap the existing delete "x" icon (currently inline SVG) to `lucide-react`, and use `lucide-react` for the new pencil/edit icon — icon usage stays consistent across the app.
- Inline editing of an existing task's text (pencil icon, click-to-edit-in-place).

**Out of scope (for future specs):**

- Real external quotes API (ZenQuotes / quotes.rest) — explored, dropped due to CORS/API-key constraints for a backend-less public-repo app; local list used instead.
- Avatar / profile picture.
- Multiple user profiles.
- Theme accent color tied to personalization.
- Editing/removing the 40 quotes from the UI (list is static, ships with the app).

## Data model

```ts
// src/features/profile/types.ts
export type Profile = {
  name: string;      // "" if the user skipped onboarding
  onboarded: boolean; // true once the onboarding modal has been shown/dismissed
};

export type ProgressBucket = "empty" | "in-progress" | "complete";
```

```ts
// src/features/profile/schema.ts (valibot)
import * as v from "valibot";

export const ProfileSchema = v.object({
  name: v.string(),
  onboarded: v.boolean(),
});
```

Persistence in localStorage:

- Key: `todo:profile:v1`
- Value: `Profile` serialized with `JSON.stringify`.
- On load, parsed JSON is validated against `ProfileSchema`; on parse failure or schema mismatch, falls back to `{ name: "", onboarded: false }` (re-triggers onboarding) instead of crashing.
- `ProgressBucket` is derived, never persisted: `empty` (0 completed), `in-progress` (some but not all), `complete` (all completed) — computed from the same `tasks` state already in `features/tasks`.

Quotes data:

```json
// src/features/profile/data/quotes.json
{
  "empty": ["...", "... (about 13 quotes)"],
  "inProgress": ["...", "... (about 14 quotes)"],
  "complete": ["...", "... (about 13 quotes)"]
}
```

```ts
// src/features/profile/quotesApi.ts
export function fetchQuoteOfTheDay(bucket: ProgressBucket): Promise<string>;
// Simulates an async API call: reads quotes.json, picks a random quote from
// the bucket's list, resolves a Promise. Swappable for a real fetch() later
// without changing call sites.
```

Conventions:

- Quotes list ships with the app (static JSON import), not editable at runtime.
- `fetchQuoteOfTheDay` always resolves (never rejects) — since it's fully local, there's no real failure mode to model, but the async shape keeps the interface future-proof.

```ts
// src/features/tasks/reducer.ts — extend existing action union
export type TasksAction =
  | { type: "ADD_TASK"; text: string }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "DELETE_TASK"; id: string }
  | { type: "EDIT_TASK"; id: string; text: string }
  | { type: "RESET_ALL" };
```

`EDIT_TASK` replaces `text` for the matching task (trimmed, no-op if empty — reducer itself guards this the same way `ADD_TASK` already does).

## Implementation plan

1. Install deps: `pnpm add valibot lucide-react`.
2. Create `src/features/profile/types.ts` (`Profile`, `ProgressBucket`) and `src/features/profile/schema.ts` (valibot `ProfileSchema`).
3. Create `src/features/profile/storage.ts` (`loadProfile`/`saveProfile`, key `todo:profile:v1`, validates with `ProfileSchema`, try/catch fallback to `{ name: "", onboarded: false }`).
4. Create `src/features/profile/data/quotes.json` (40 quotes bucketed `empty`/`inProgress`/`complete`) and `src/features/profile/quotesApi.ts` (`fetchQuoteOfTheDay(bucket)`).
5. Create `src/features/profile/useProfile.ts`: exposes `name`, `onboarded`, `setName`, `skipOnboarding`; persists via `storage.ts` on change.
6. Extend `src/features/tasks/reducer.ts` with the `EDIT_TASK` action (trims, no-op on empty, same guard style as `ADD_TASK`); extend `src/features/tasks/useTasks.ts` with `editTask(id, text)`.
7. Swap the existing inline SVG "x" in `TaskItem.tsx` for `lucide-react`'s `X` icon. Manual test: delete button still opens the confirm modal correctly.
8. Add inline edit mode to `TaskItem.tsx`: `lucide-react`'s `Pencil` icon triggers edit, text becomes an input, Enter/blur saves via `editTask`, Escape cancels, empty text blocks save (input stays, no dispatch).
9. Create `src/shared/components/molecules/NameModal.tsx`: text input + "Save" + "Skip" (skippable), reused for both onboarding and later edits.
10. Create `src/shared/components/organisms/ProfileHeader.tsx`: displays name (or "Hi there" if skipped) + pencil to reopen `NameModal`, today's date ("Today, July 13"), and the motivational phrase — calls `fetchQuoteOfTheDay(bucket)` on mount and whenever the progress bucket changes.
11. Wire `ProfileHeader` into `TasksPage.tsx` (above the progress bar). Show `NameModal` automatically on mount when `!profile.onboarded`.
12. Verify responsive layout with the new header. Manual pass through all acceptance criteria.

## Acceptance criteria

- [x] On first visit (no saved profile), the name onboarding modal appears automatically.
- [x] Entering a name and saving persists it; reloading the page shows the same name.
- [x] Skipping onboarding dismisses the modal, shows a generic greeting ("Hi there"), and does not re-prompt on reload.
- [x] Clicking the pencil icon next to the name reopens the name modal to edit it; saving updates the displayed name and persists it.
- [x] Today's date displays in "Today, [Month] [Day]" format and matches the actual current date.
- [x] A motivational phrase is shown, sourced from the local 40-quote list, matching the current progress bucket (empty/in-progress/complete).
- [x] Completing the last remaining task live-updates the phrase to one from the "complete" bucket without a page reload.
- [x] Uncompleting a task from 100% live-updates the phrase back to an "in-progress" bucket quote.
- [x] A corrupted/invalid profile object in localStorage does not crash the app — falls back to the onboarding flow.
- [x] Clicking the pencil icon on a task turns its text into an editable input.
- [x] Pressing Enter or clicking away (blur) while editing a task saves the new text.
- [x] Pressing Escape while editing a task cancels the edit, restoring the original text.
- [x] Attempting to save an empty task edit is blocked — the task keeps its original text.
- [x] The delete "x" icon on a task renders as the lucide `X` icon and still opens the delete confirmation modal.
- [x] The app loads with no console errors.

## Decisions

- **No:** ZenQuotes API (`/api/random`, `/api/today`). CORS blocked without an API key; app has no backend to hide the key.
- **No:** ZenQuotes "On This Day" API. Explored per user request, but returns historical events/births/deaths, not motivational quotes — wrong content entirely.
- **No:** quotes.rest / They Said So API. Same class of problem — requires an API token (`Authorization` header, confirmed via live docs screenshot), and this app has no backend to protect a secret.
- **Yes:** local static list of 40 quotes (`data/quotes.json`), bucketed by progress (empty/in-progress/complete). No network dependency, works offline, no key-exposure risk — fits this app's no-backend architecture.
- **Yes:** `fetchQuoteOfTheDay()` still shaped as an async function returning a `Promise`, even though it's fully local. Keeps the interface swappable for a real API later without touching call sites.
- **Yes:** `valibot` to validate the `Profile` object parsed from `localStorage`, catching corrupted/malformed data the same defensive way `loadTasks` already does in spec 01, but with real shape validation instead of just an array check.
- **Yes:** onboarding is skippable, falls back to a generic greeting. Avoids a hard gate in a "very minimalist" personal app.
- **Yes:** name is editable later via a pencil icon (not clicking the text directly) — matches the existing discoverability reasoning from spec 01's UI decisions.
- **Yes:** `lucide-react` for icons, applied consistently — swaps the existing inline-SVG delete "x" from spec 01 too, not just new icons. Avoids two icon systems coexisting.
- **Yes:** task editing (`EDIT_TASK` action, inline edit in `TaskItem`) folded into this spec, even though it's a distinct feature from personalization. User explicitly overrode the suggestion to split it into its own spec — recorded here per the "quick definition, scope widened by user override" pattern.
- **Yes:** task edit is inline (input replaces text in place), not a modal — editing a single line of text doesn't warrant a heavier UI, and it's non-destructive (unlike delete/reset) so no confirmation step is needed.
- **No:** confirmation modal for task edits. Only delete/reset are destructive enough to warrant one (per spec 01's decisions); editing text is reversible by editing again.

## Risks

| Risk                                                          | Mitigation                                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Corrupted/malformed profile data in `todo:profile:v1`         | `valibot` schema validation on load; falls back to `{ name: "", onboarded: false }` (re-onboards) instead of crashing. |
| `quotes.json` missing a quote for the current bucket (edit mistake) | `fetchQuoteOfTheDay` falls back to a hardcoded default string if the bucket array is empty, never throws. |

## What is **not** in this spec

- Real external quotes API (ZenQuotes / quotes.rest) — dropped due to CORS/API-key constraints.
- Avatar / profile picture.
- Multiple user profiles.
- Theme accent color tied to personalization.
- Editing/removing the 40 quotes from the UI.

Each of these, if needed, goes in its own spec.
