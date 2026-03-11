# Commit Message Guidelines

When generating git commit messages, always follow these rules:

## Format
Use Conventional Commit format:

<type>: short summary

Examples:
feat: add login with Google
fix: resolve quantity update bug
refactor: simplify product fetch logic
docs: update setup instructions

## Rules

- Keep summary under 72 characters
- Use present tense ("add", not "added")
- Do not capitalize the first letter
- Do not end with a period
- Focus on WHAT changed and WHY
- Group related changes

## Body (Optional)

If the change is complex include:

- What changed
- Why it changed
- Impact

Example:

feat: add fuzzy search for product names

Improves search UX by allowing partial matches.
Uses fuse.js for fuzzy matching.

## Types

Allowed commit types:

- feat → new feature
- fix → bug fix
- refactor → code restructuring
- perf → performance improvement
- docs → documentation
- style → formatting only
- test → tests
- chore → maintenance tasks

Always analyze the git diff before generating the message.