# Vue Best Practices

All code generated in this repository must follow these rules.

## Vue Rules

- Always use Composition API
- Prefer `<script setup>`
- Use TypeScript
- Avoid Options API

## Architecture

pages → route components  
components → reusable UI  
composables → business logic  
api → API requests  
stores → pinia stores

## Code Style

- use async/await
- avoid deeply nested logic
- small components
- reusable composables

## UI Rules

- TailwindCSS only
- responsive layout
- accessibility attributes

## Performance

- lazy load images
- use dynamic imports for routes
- avoid unnecessary watchers