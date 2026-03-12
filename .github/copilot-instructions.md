# Copilot Instructions for photo-share-ai

Use these rules when generating or modifying code in this repository.

## Stack and patterns

- Vue 3 + Vite + TypeScript
- Composition API only
- Prefer `<script setup lang="ts">`
- TailwindCSS-only styling
- Pinia for state and composables for business logic

## Project architecture

- `pages/` route-level components
- `components/` reusable UI components
- `composables/` reusable business logic
- `api/` API requests and fetch helpers
- `stores/` Pinia stores

Follow existing separation of concerns. Avoid moving logic between layers unless explicitly requested.

## Coding guidelines

- Use async/await
- Keep components small and focused
- Avoid deeply nested logic
- Add loading and error states for async UI flows
- Keep changes minimal and aligned with existing code style
- Do not introduce new libraries unless clearly needed

## Quality checks before finishing

- Run type-check: `npm run type-check`
- Run lint: `npm run lint`
- Ensure no unrelated files are changed

## Commit message style

Use Conventional Commits:

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code restructuring
- `perf:` performance improvement
- `docs:` documentation
- `style:` formatting only
- `test:` tests
- `chore:` maintenance

Summary rules:

- under 72 chars
- present tense
- lowercase start
- no trailing period
