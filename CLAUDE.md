# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

## What this is

Personal, single-user todo list. Gamification is intentionally minimal: a progress bar for the day, no points, no streaks. Black & white, Apple-inspired minimal design. No backend — state persists in `localStorage` only.

## Stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, oxlint. Package manager: pnpm.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — `tsc -b` then `vite build`
- `pnpm lint` — oxlint
- `pnpm preview` — preview production build

## Architecture

**Feature-based + atomic design**, combined:

```
src/
  features/<feature>/           # domain logic for one feature
    types.ts                    # data shapes
    storage.ts                  # localStorage read/write, wrapped in try/catch
    reducer.ts                  # pure reducer, one action union
    use<Feature>.ts             # useReducer + persistence effect
    <Feature>Page.tsx           # composes shared components, owns UI-only local state (e.g. which modal is open)
  shared/components/
    atoms/                      # no business logic, pure presentation (Button, Checkbox, Text, IconButton)
    molecules/                  # small compositions of atoms (ProgressBar, ConfirmModal, TaskItem)
    organisms/                  # compositions of molecules/atoms tied to a shape of data (TaskList, AddTaskForm)
```

Rules:

- State management is `useReducer`, not scattered `useState`, for anything with discrete actions (add/toggle/delete/reset).
- Persistence (`storage.ts`) always wraps `localStorage` calls in try/catch — must degrade to in-memory-only, never throw and break the UI (private browsing / quota exceeded).
- Destructive actions (delete, reset) always go through `ConfirmModal`, never fire directly from a click.
- Modal/dialog open state is local component state, not URL params — no router in this app, keep it simple.
- `shared/components` must stay feature-agnostic. If a component needs to import from `features/`, it belongs in the feature folder instead.
- No extra dependencies for things the platform already provides (e.g. `crypto.randomUUID()` for IDs, not `uuid`).

## Design language

Black & white only, no color accent. System font stack (`-apple-system` first) — do not introduce a second type family. Motion is intentional and minimal: one signature interaction (currently the checkbox "pop"), everything else is quiet transitions. Respect `prefers-reduced-motion`. When making UI/visual decisions, use the `frontend-design` skill.

## Spec workflow

Features are designed with `/spec` (produces `specs/NN-slug.md`, starts as `Draft`) and built with `/spec-impl` (only runs against `Approved` specs, implements step by step with pauses for review). Read the latest 1-2 files in `specs/` before starting new feature work to pick up established conventions and past decisions.
