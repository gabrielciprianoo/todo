# SPEC 01 — Gamified personal todo list

> **Status:** Approved
> **Depends on:** —
> **Date:** 2026-07-13
> **Objective:** Minimalist todo list where the user creates, completes, and deletes daily tasks, seeing progress on a progress bar, with an optional full reset.

## Scope

**In:**

- Create task (text only).
- Complete task (strike-through, adds to the progress bar).
- Delete individual task (button "x" + confirmation modal).
- Reset all (button that deletes all tasks and resets progress to zero, with a confirmation modal explaining the action).
- Progress bar (completed / total).
- Persistence in localStorage.
- Minimalist Apple-style design: black/white, refined typography, clean animations (implemented with the help of the `frontend-design` skill during `/spec-impl`).

**Out of scope (for future specs):**

- Numeric points / scoring system.
- Streaks or automatic daily reset.
- Manual ordering (drag & drop) or priority.
- Categories, dates, time, or any extra field on a task.
- Multi-user / auth / backend.
- Configurable dark/light mode.

## Data model

```ts
// src/features/tasks/types.ts
export type Task = {
  id: string;        // crypto.randomUUID()
  text: string;
  completed: boolean;
  createdAt: number; // Date.now(), defines order (creation)
};
```

Persistence in localStorage:

- Key: `todo:tasks:v1`
- Value: `Task[]` serialized with `JSON.stringify`.
- Progress (for the bar) is **derived** in memory: `completed.length / tasks.length` — not persisted as a separate field.
- "Reset all" = `localStorage.removeItem('todo:tasks:v1')` + in-memory state goes back to `[]`.

Conventions:

- IDs: `crypto.randomUUID()` (natively supported, no extra dependency).
- List order: by `createdAt` ascending (creation order), no manual reordering.

## Implementation plan

1. Create base folder structure: `src/shared/components/{atoms,molecules,organisms}` and `src/features/tasks/`. No logic yet, just folders + `.gitkeep` if needed.
2. Define `src/features/tasks/types.ts` (`Task` type) and `src/features/tasks/storage.ts` (functions `loadTasks`, `saveTasks`, `clearTasks` over `localStorage` key `todo:tasks:v1`).
3. Define `src/features/tasks/reducer.ts`: actions `ADD_TASK`, `TOGGLE_TASK`, `DELETE_TASK`, `RESET_ALL` + pure reducer function. Manual test: exercise the reducer in isolation via console/dev tools.
4. Create hook `src/features/tasks/useTasks.ts`: wraps `useReducer` + syncs with `storage.ts` (initial load, persists on every change via `useEffect`).
5. Build atoms in `src/shared/components/atoms/`: `Button.tsx`, `Checkbox.tsx`, `IconButton.tsx`, `Text.tsx`. No business logic, presentation only with B&W Apple-like styling.
6. Build molecules in `src/shared/components/molecules/`: `ProgressBar.tsx` (receives `completed`/`total`), `ConfirmModal.tsx` (generic: title, message, confirm/cancel), `TaskItem.tsx` (checkbox + text struck-through if completed + delete button).
7. Build organisms in `src/shared/components/organisms/`: `TaskList.tsx` (maps `TaskItem`), `AddTaskForm.tsx` (input + submit).
8. Create `src/features/tasks/TasksPage.tsx`: composes `ProgressBar`, `AddTaskForm`, `TaskList`, "Reset all" button + `ConfirmModal`, using `useTasks()`. Manages opening/closing modals (individual delete vs full reset) as local state.
9. Update `src/App.tsx` to render `TasksPage`. Apply global typography and layout (font, B&W colors, spacing) in `src/index.css`.
10. Polish clean animations (transition when striking a task, when deleting, when opening/closing a modal) using the `frontend-design` skill as style guidance. Verify basic responsiveness.

## Acceptance criteria

- [ ] The app loads with no console errors.
- [ ] Typing text and confirming adds a new task at the end of the list.
- [ ] A task cannot be added with empty text.
- [ ] Clicking a task's checkbox strikes it through visually and adds to the progress bar.
- [ ] Clicking the checkbox again unstrikes it and subtracts from the progress bar.
- [ ] The "x" button on a task opens a confirmation modal; confirming deletes only that task; canceling deletes nothing.
- [ ] The "Reset all" button opens a confirmation modal explaining that all tasks and progress will be deleted; confirming leaves the list empty and the bar at 0%.
- [ ] Reloading the page (F5) preserves tasks and their state (completed/pending) exactly as left.
- [ ] After "Reset all" and reloading the page, the list stays empty (no old tasks reappear).
- [ ] The progress bar correctly shows `completed / total` at all times (including the 0-tasks case = 0%).

## Decisions

- **Yes:** localStorage for persistence. No backend, data easily fits, no queries needed.
- **No:** IndexedDB. Overengineering for a small task array.
- **Yes:** versioned key (`todo:tasks:v1`). Allows migrating the schema later without breaking existing data.
- **Yes:** progress derived in memory (`completed/total`), not persisted as a separate field. Avoids inconsistency between the stored field and the actual task state.
- **No:** numeric points system. The user asked to measure daily progress, not scoring — the progress bar already covers that.
- **No:** manual ordering (drag & drop) or priority. Creation order is enough for v1, less surface for bugs.
- **Yes:** confirmation modal for both individual task deletion and "Reset all". Both are irreversible destructive actions (no undo).
- **Yes:** `crypto.randomUUID()` for IDs. Native to the browser, no extra dependency.
- **Yes:** feature-based architecture (`src/features/tasks/`) + atomic design in `src/shared/components/` (atoms/molecules/organisms). Separates reusable pieces (generic atoms/molecules) from task-feature-specific logic.
- **Yes:** `useReducer` for task state instead of multiple `useState`. The actions (add/toggle/delete/reset) are discrete and benefit from a pure, testable reducer.
- **Yes:** minimalist Apple-style visual design (black/white, refined typography, clean animations), using the `frontend-design` skill as guidance during `/spec-impl`.
- **No:** configurable dark/light mode. Out of scope for v1.

## Risks

| Risk                                                 | Mitigation                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| localStorage disabled (private mode/quota)           | App keeps working in memory for the session; simply doesn't persist on reload.                |
| Corrupted data in `todo:tasks:v1` (invalid JSON)     | `loadTasks` try/catches the parse; on failure, starts with an empty list instead of crashing.  |

## What is **not** in this spec

- Numeric points / scoring system.
- Streaks or automatic daily reset.
- Manual ordering (drag & drop) or priority.
- Categories, dates, time, or other fields on a task.
- Multi-user / auth / backend.
- Configurable dark/light mode.

Each of these, if needed, goes in its own spec.
