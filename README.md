# Deryl Portfolio

Personal portfolio of **Stiven Deryl Imanuel Pyo**, Web Developer and IT Support.
Rebuilt on the design system and interaction language of the reference
repository [RyHarJr/portofoliov2](https://github.com/RyHarJr/portofoliov2):
Next.js App Router, TypeScript, Tailwind CSS v4, and `motion` for animation.

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: `motion` (Framer Motion)
- **Chat**: streaming route backed by an OpenAI-compatible endpoint

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Scripts:

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run the production build
- `npx eslint .` — lint

## Project structure

```
app/            pages and sections (page.tsx composes the sections)
  api/chat/     streaming chat route (server-side key only)
components/     reusable UI (Header, PageLoader, GlareHover, ScrollVelocity)
  animations/   Fade / FadeUp / FadeDown / FadeLeft / FadeRight
data/           content, separated from presentation
styles/         globals.css (design tokens, light + dark themes)
public/         static assets served at /
docs/PRD.md     the full product spec and decision log
legacy/         the previous static HTML site, kept for reference
```

## Section order

Hero, Companies, About, Graduation (wisuda), Experience, Tech Stack, Projects,
Certificates, Contact. The Graduation showcase sits immediately before Work
Experience by design.

---

## How to fill in content

### 1. Add a CV (Download CV button)

Drop your PDF at:

```
public/cv/cv.pdf
```

The hero checks for that exact file with a HEAD request. While it is missing the
button shows an inactive "Segera" state and never errors. As soon as
`public/cv/cv.pdf` exists, the button becomes a real download link. Only the file
name is fixed; to change the path, update the two references in `app/hero.tsx`.

### 2. Add projects

Open `data/projects.ts` and add objects to the `projectList` array. A commented
template is included at the top of the file. Put screenshots in
`public/projects/` and reference them as `/projects/<file>`.

The UI is empty-safe:

- No projects: the section shows an honest "Karya sedang disiapkan" state.
- Missing `imagePath`: a neutral placeholder block, never a broken image.
- Missing `liveDemoUrl` / `githubUrl`: disabled buttons, never dead links.

No component code needs to change to add projects.

### 3. Edit experience, skills, and companies

- `data/experience.ts` — work experience. The `date` field is rendered when
  filled and hidden cleanly while empty. Nothing is invented.
- `data/tech-stack.ts` — skill categories. Icons live in `public/icons/`.
- `data/companies.ts` — the Lawkey and PT Primadaya cards.
- `data/profile.ts` — bio, tagline, contact links, personal details.
- `data/graduation.ts` — the wisuda gallery images.
- `data/certificates.ts` — certificate list.

---

## Chat configuration

The chat UI (launcher + full-screen overlay) is fully functional. It opens,
sends, streams, shows a typing indicator, persists history in `localStorage`,
renders markdown, and has an honest error state. To make the AI answer, configure
the server route.

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Purpose |
|---|---|---|
| `AI_API_KEY` | Yes | Server-side key for an OpenAI-compatible endpoint |
| `AI_BASE_URL` | No | Defaults to `https://integrate.api.nvidia.com/v1` |
| `AI_MODEL` | No | Defaults to `meta/llama-3.1-8b-instruct` |
| `NEXT_PUBLIC_BASE_URL` | No | Canonical/OG base URL |

The key is read only in `app/api/chat/route.ts` on the server and is never sent
to the browser. Without `AI_API_KEY`, the route returns a clear
"Konfigurasi API AI tidak ditemukan" message and the UI tells the visitor the
assistant is not configured instead of faking a reply.

Restart the dev server after editing `.env.local`.

---

## Theming

Both light and dark themes ship and both work. Dark is the default for a
developer portfolio; a toggle in the navbar switches to light and the choice is
remembered in `localStorage`. Tokens live in `styles/globals.css`.

---

## Accessibility

- Semantic landmarks and heading order.
- Keyboard operable: nav, theme toggle, mobile menu, gallery, lightbox, project
  modal, certificate modal, and chat (all modals close with `Escape`).
- Visible focus indicators (never removed).
- `prefers-reduced-motion` collapses animation to the resting state.
- Text contrast meets WCAG AA in both themes.

## Notes

- The previous static site is preserved under `legacy/` and was not deleted.
- Real assets only. No stock or generated images, no invented data.
