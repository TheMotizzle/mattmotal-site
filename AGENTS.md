# AGENTS.md

## Project intent
This repo contains a new Next.js site and a previous static HTML site in `legacy-site/`.
The goal is to migrate legacy content into structured JSON and render it in the new site.

## Rules
- `legacy-site/` is read-only source material.
- Prefer deterministic scripts over manual copy/paste.
- Preserve exact legacy wording whenever possible.
- Use TypeScript.
- Keep edits minimal and easy to review.
- Put extracted content under `content/`.
- Put migration scripts under `scripts/`.
- Prefer structured JSON over embedding raw HTML.
- If content is ambiguous, keep the source text and flag it for review.
