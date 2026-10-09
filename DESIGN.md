# DESIGN.md: Stiven Deryl Imanuel Pyo

## Identity

Personal portfolio for a web developer and IT Support, Informatics graduate,
currently interning as a Web Developer. Audience: recruiters, collaborators, and
clients.

## Direction

Reference-first rebuild of the design language from `RyHarJr/portofoliov2`.
Neutral, high-contrast, typography-led. No brand hue: contrast and spacing carry
the identity. Dark is the default for a developer portfolio; a working light
theme ships too.

## Palette

Tokens live in `styles/globals.css`. Two themes, both shipped and both working.

Light:

- Background: #fdfdfd
- Thirdary (card surface): #f3f4f6
- Text primary: #111827
- Text secondary: #5b6472
- Button hero: #111827

Dark:

- Background: #0a0a0a
- Foreground: #121212
- Thirdary (card surface): #171717
- Text primary: #ececec
- Text secondary: #a1a1aa
- Button hero: #ffffff

No accent color is used as fill. Emphasis comes from size, weight, and the
contrast between primary and secondary text. Every text pairing meets WCAG AA in
both themes.

## Typography

- Poppins, weights 400 to 900 (via next/font).
- Display: `font-black`, `tracking-tighter`, large (`text-4xl` to `text-7xl`) for
  the name and section titles.
- Eyebrow labels: small, uppercase, wide tracking, secondary color.
- Body: 14 to 18px, medium weight, relaxed leading.

## Layout

- Single centered column, `max-w-7xl`, `px-6 md:px-12`, `py-24 md:py-32`.
- Pill navbar, rounded cards, hairline borders (`border-text-secondary/10` and
  `/20`), selective shadows.
- Sections separated by a hairline `border-t`.
- Section order: Hero, Companies, About, Graduation, Experience, Tech Stack,
  Projects, Certificates, Contact.

## Motion

- Opening loader (PageLoader), blur-out exit.
- Per-element scroll reveals via Fade / FadeUp / FadeDown / FadeLeft / FadeRight
  (blur plus translate plus spring), one-shot.
- Hero typing effect.
- Scroll-progress timeline line in Experience.
- ScrollVelocity marquee in About.
- GlareHover sweep on project and company cards.
- Chat overlay slide/scale, typing dots.
- All motion collapses under `prefers-reduced-motion`.

## Content rules

- Real assets and real facts only. No invented statistics, dates, testimonials,
  or achievements.
- Experience shows only Lawkey and PT Primadaya Plastisindo Tbk. Dates and
  details stay empty until verified and render cleanly while empty.
- Projects are data-driven in `data/projects.ts`, empty-safe with an honest
  empty state.
- The chat assistant is honest about its configuration state; it never fakes a
  reply.
- Indonesian copy, natural and specific, no em dashes.

## Dials

ENERGY 2 / RHYTHM 3 / MOTION 3
