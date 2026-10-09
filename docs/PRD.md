# PRD: Portfolio Revitalization, Reference-Based Rebuild

Owner: Stiven Deryl Imanuel Pyo
Reference repository: https://github.com/RyHarJr/portofoliov2
Status: Implementation spec, drives the rebuild
Last updated: 2026-02-14

---

## 1. Purpose and scope

Revitalize the existing personal portfolio by adapting the design system, layout,
motion, and features that actually exist in the reference repository
(`RyHarJr/portofoliov2`). The goal is fidelity to the reference experience, not a
new invented design.

In scope:

- Full visual and interaction language from the reference (layout, palette,
  typography, motion, components, theme toggle, opening loader).
- Chat feature adapted from the reference (streaming UI plus server route).
- New sections required by the owner: company grid, graduation photo showcase.
- Content migration: keep the owner's real profile, assets, and facts.

Out of scope:

- Inventing statistics, dates, project details, testimonials, or achievements.
- Real AI credentials (no live key is shipped; see section 5).
- Adding unrelated features or dependencies.

---

## 2. Reference design audit and feature mapping

The reference is a Next.js 16 App Router project, in TypeScript, styled with
Tailwind CSS v4, animated with `motion` (Framer Motion), font Poppins,
with a light/dark theme toggle and a streaming AI chat backed by a server route.

### 2.1 Design identity observed in the reference

- **Palette**: near-white background (`#fdfdfd`) with a dark theme
  (`#0a0a0a`), a neutral "thirdary" surface, primary text near-black/`#ececec`,
  secondary grey text. No brand hue; contrast carries identity. Dark is the
  intended default for a developer portfolio.
- **Typography**: Poppins (400, 600). Headings are `font-black`,
  `tracking-tighter`, large (`text-4xl` to `text-7xl`). Section headers use a
  small uppercase tracking-widest eyebrow plus a big title.
- **Shape language**: large radii, pill navbar, rounded cards, hairline borders
  (`border-text-secondary/10` and `/20`), soft but selective shadows.
- **Motion**: opening `PageLoader` (2s, blur-out exit), per-element scroll
  reveals (`FadeUp/Down/Left/Right`, blur + translate + spring), typing effect
  in the hero, scroll-progress timeline in Experience, `ScrollVelocity` marquee,
  `GlareHover` sweep on project cards, animated project modal, floating stat
  badges, infinite project slider on mobile.
- **Structure**: single centered column, `max-w-7xl`, `px-6 md:px-12`,
  `py-24 md:py-32` section rhythm, `border-t` hairline between sections.

### 2.2 Feature mapping (reference to this portfolio)

| Reference feature | Source file | Adapt to |
|---|---|---|
| Page opening loader | `components/PageLoader.tsx` | Same, text becomes owner name |
| Pill nav, theme toggle, active section | `components/Header.tsx` | Same |
| Hero typing effect, photo, floating stat badges, socials | `app/hero.tsx` | Same, real owner content, CV button |
| Scroll-reveal wrappers | `components/animations/*` | Same components |
| About split with portrait, personal details grid | `app/about.tsx` | Same layout, real owner data |
| ScrollVelocity marquee | `components/ScrollVelocity.tsx` | Same, owner name/tagline |
| Experience scroll timeline, list hover blur | `app/experience.tsx` | Only 2 entries (Lawkey, Primadaya) |
| Tech stack category grids | `app/tech-stack.tsx` | Real owner skills only |
| Project grid + modal + mobile slider | `app/project.tsx` | Data-driven, empty-safe |
| Contact social cards | `app/contact.tsx` | Owner real links |
| Chat launcher, full-screen chat, streaming, localStorage, markdown | `app/contact.tsx` | Same, owner Assistant |
| Chat streaming API (server-side key) | `app/api/chat/route.ts` | Same route, key from env |
| Glare hover | `components/GlareHover.tsx` | Same |
| Footer | `components/Footer.tsx` | Same, owner links |

### 2.3 Chat implementation facts (verified)

- Launcher: fixed floating round button bottom-right with an "AI" ping badge.
- Chat: full-screen overlay (not a small widget), backdrop blur, slides and
  scales in, header with AI avatar, "Online" pulse, clear/restart and close
  buttons, message list, markdown rendering for bot messages, typing dots while
  loading, input + send button, message timestamps.
- State: messages and a generated guest name persisted in localStorage
  (`ryhar_chat_*` keys). History sent to the API as a system prompt plus turn map.
- Backend: `/api/chat` edge route, OpenAI SDK pointed at an NVIDIA-compatible
  base URL, model `thinkingmachines/inkling`, streaming via `ReadableStream`,
  key read from `process.env.NVIDIA_APIKEY`. **Key is never exposed to the client.**
- Consequence: chat is a real streaming client; it becomes fully functional once
  a server-side key and a reachable compatible endpoint are configured. Without
  them the UI still renders, sends, and shows the reference error state, and must
  not pretend the AI is connected.

---

## 3. Section structure and order

```
Header (fixed pill nav + theme toggle)
Hero ............... id="home"      typing role, photo, stats badges, socials, Download CV
Companies .......... id="companies" Lawkey + PT Primadaya Plastisindo (after hero, before About)
About .............. id="about"      portrait + Who Am I / My Approach + personal details + marquee
Graduation ......... id="graduation" wisuda gallery, placed before Experience
Experience ......... id="experience" only Lawkey + PT Primadaya Plastisindo
Tech Stack ......... id="techstack"  real skills only
Projects ........... id="projects"   data-driven grid + modal
Contact ............ id="contacts"   social cards + floating chat
Footer
```

Rationale for placement decisions (R-31):
- Company grid sits right after the hero so the two organizations read as
  credentials before the narrative About, matching how the owner framed it.
- Graduation showcase sits immediately before Work Experience, as required, so
  the education-to-career narrative flows without an extra link.

---

## 4. Asset mapping

Verified actual locations (no guesses):

| Asset | Actual path | Used by |
|---|---|---|
| Profile photo | `assets/img/profile.jpeg` | Hero portrait, About portrait |
| Graduation photos | `assets/img/wisuda/wisuda1..5.(jpeg/JPG)` | Graduation showcase |
| Lawkey logo | `assets/img/logo/lawkey.jpeg`, `lawkey-dashboardweb.jpeg` | Companies grid |
| Primadaya logo | `assets/img/logo/logo-primadaya.png`, `logo-pdp.webp` | Companies grid |
| Tech icons | reference `public/icons/*.svg` (copied) | Tech stack |
| CV (pending) | `public/cv/` (to be added) | Download CV button |
| Project photos (pending) | `public/projects/` (to be added) | Projects |

Notes:
- The existing `index.html` referenced `assets/img/prp.jpeg`, which does not
  exist. The real file is `assets/img/profile.jpeg`.
- The existing CSS referenced `assets/img/icon/1..10.png`, which does not exist.
  The new implementation does not depend on that folder.
- Assets are copied into `public/` for the Next.js app; originals are preserved.

---

## 5. Chat feature specification

- Component: floating launcher + full-screen overlay, faithful to reference.
- Working now: open/close, Escape close, backdrop close, input, send, optimistic
  user message, typing indicator, empty handling, error state, localStorage
  persistence, markdown rendering, streaming reader.
- Server route `POST /api/chat`: accepts `{ text, history }`, streams plain text.
  Reads API key from env (`NVIDIA_APIKEY`, base URL configurable).
- Required configuration (documented, not shipped): a valid server-side key and a
  reachable OpenAI-compatible base URL and model. Documented in `.env.example`
  and README. No secret is committed.
- Honesty requirement: when not configured, the route returns a clear "AI not
  configured" message; the UI surfaces an error state. It never fakes replies.

---

## 6. Language and framework migration strategy

Decision: **rebuild on Next.js + TypeScript + Tailwind CSS v4 + motion**, to match
the reference stack (priority 1 in the task) and to support the reference's
opening loader, scroll motion, theme toggle, and streaming server chat cleanly.

- Rationale: the reference is TS/Next; guaranteeing motion + streaming chat +
  server-side key handling on a static HTML site would mean re-implementing a
  backend and a build step anyway. Aligning the stack maximizes fidelity and
  maintainability, and TypeScript is explicitly preferred.
- Content preserved: profile, education, internship, skills, contact links, and
  all assets carry over. Nothing valid is deleted; the old static site is kept
  as `legacy/` for reference rather than destroyed.
- Data separation: profile facts, experience, tech, and projects live in
  `data/*.ts` files; components consume them. Projects and CV remain
  placeholder-safe until the owner fills them.

---

## 7. Responsiveness and accessibility

- Breakpoints: mobile (1 col), tablet (split), desktop (`max-w-7xl` grids), per
  reference. No horizontal overflow. Tap targets >= 44px.
- Motion respects `prefers-reduced-motion`: reveals settle to resting state.
- Semantic landmarks, keyboard operability, Escape-closable overlays, visible
  focus. Contrast meets WCAG AA in both light and dark themes (both shipped must
  work, R-34).

---

## 8. Acceptance criteria and test plan

1. Design adapted from the audited reference (palette, type, motion, components).
2. Layout, type, color, animation, interaction are visually consistent.
3. Stack decision documented (section 6).
4. Profile photo used in Hero and About.
5. Lawkey + Primadaya logo section after hero, before About.
6. Lawkey link points to https://www.lawkey.id/#top.
7. Graduation gallery uses real `wisuda` assets, immediately before Experience.
8. Experience shows only Lawkey + Primadaya Plastisindo.
9. Projects section is data-driven and safe when empty (no broken images/links).
10. Download CV button present, works when the PDF exists, no error before then.
11. Chat works per actual integration capability (UI fully functional; streaming
    once configured).
12. Responsive on desktop, tablet, mobile.
13. No broken assets, wrong links, or unhandled build errors.
14. No invented profile data or achievements.
15. Docs explain adding projects, CV, and chat configuration.

Test plan: `npm run build` and `npm run lint` clean; start server, click through
every control (nav, theme, CV, graduation gallery/lightbox, project modal, chat
open/send/close/clear) and record results; check console; check both themes;
check mobile breakpoints.

---

## 9. Technical decision log

- Kept the old static site (moved to `legacy/`) instead of deleting, per the
  no-destructive-operations rule.
- Removed the reference's Google Maps embed and the "Mami Steak Gunting"
  location: it is another person's real business, not the owner's data (R-38).
- No placeholder statistics. The reference's "2+ years", GPA, etc. are not
  reused because they are not the owner's verified facts (R-17).
- Graduation showcase: expandable grid plus lightbox (chosen single approach,
  not stacked effects), matching the reference's modal interaction language.
- Certificates section from the old site is preserved as a data-driven section.
