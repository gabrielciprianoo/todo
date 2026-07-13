# Personal To Do List App

Minimalist, gamified personal todo list. Create tasks, complete them, watch a progress bar fill for the day. Black & white, Apple-inspired UI, no backend — everything lives in `localStorage`.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- oxlint

## Scripts

```bash
pnpm install     # install deps
pnpm dev         # start dev server
pnpm build       # typecheck + production build
pnpm preview     # preview production build
pnpm lint        # oxlint
```

## Structure

```
src/
  features/tasks/        # task domain: types, reducer, storage, hook, page
  shared/components/      # atomic design: atoms, molecules, organisms
```

See `CLAUDE.md` for architecture conventions and `specs/` for feature specs.
