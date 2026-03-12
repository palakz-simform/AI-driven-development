# photo-share-ai

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## AI-Driven Vue Development Setup

This repository is configured for AI-assisted development in VS Code.

### Included AI context

- `.github/copilot-instructions.md` for project-specific coding rules
- `.github/instructions/*.instructions.md` for Vue best practices and commit style
- `.github/prompts/` for reusable prompt templates
- `.github/agents/` and `.github/skills/` for structured AI workflows

### Recommended VS Code workflow

1. Install recommended extensions when prompted.
2. Start app + local API together:

```sh
npm run dev:all
```

3. Ask Copilot Chat to follow project instructions from `.github/copilot-instructions.md`.
4. Before finishing generated changes, run:

```sh
npm run type-check
npm run lint
```
