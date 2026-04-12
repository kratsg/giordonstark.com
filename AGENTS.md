# AGENTS.md

Agent instructions for maintaining this site. All content lives in `src/data/*.yaml`. Components in `src/components/` read those files at build time — each component defines TypeScript interfaces in its frontmatter that describe the exact shape of the YAML it consumes. Read the relevant component if you need the full schema; this file covers the common cases.

## Where things go

| What you're adding                          | File                                                 | Notes                                 |
| ------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| Mentee (undergrad or grad)                  | `src/data/mentees.yaml`                              | `undergraduate` or `graduate` list    |
| Talk (seminar, colloquium, conference)      | `src/data/talks.yaml`                                | see talk types below                  |
| Service / leadership role                   | `src/data/service.yaml` → `roles`                    |                                       |
| Outreach activity                           | `src/data/service.yaml` → `outreach`                 |                                       |
| Community / white paper                     | `src/data/service.yaml` → `community_papers`         |                                       |
| Physics analysis or instrumentation project | `src/data/research.yaml`                             | grouped under `categories[].projects` |
| Software / open-source project              | `src/data/software.yaml`                             | grouped under `categories[].projects` |
| Award or honor                              | `src/data/awards.yaml`                               |                                       |
| Job / position                              | `src/data/professional_history.yaml`                 |                                       |
| Course taught or TA'd                       | `src/data/teaching.yaml`                             |                                       |
| Workshop or tutorial                        | `src/data/teaching.yaml` → `workshops_and_tutorials` |                                       |
| Press / media item                          | `src/data/media.yaml`                                |                                       |
| Social link                                 | `src/data/social.yaml`                               |                                       |

## Date formats

Two formats exist — do not mix them:

**`YYYY-MM`** — machine-parseable, used where sorting or humanization is needed:

- `talks[].date` → rendered as "August 2024" via `humanizeDate()`
- `community_papers[].date` → same
- `professional_history` positions: `start_date` / `end_date` → rendered as "August 2018 – July 2024" via `formatDateRange()`; omit `end_date` for current roles

**Free-text** — used everywhere else; rendered as-is:

- `mentees[].period` → `"2022-2025"`, `"2025-present"`, `"2023"`
- `service.roles[].period` → `"Jan 2025-present"`, `"2023-2024"`
- `awards[].date` → `"May 2025"`, `"2019"`
- `teaching` dates/periods → `"Jun 2024"`, `"Fall 2016-2017"`

Helpers live in `src/utils/date.ts` (tested in `src/utils/date.test.ts`).

## Ordering conventions

- **`talks.yaml`** — newest first; the component does not re-sort
- **`mentees.yaml`** — newest first within each list; the component does not re-sort
- **`community_papers`** — sorted descending by `date` at render time; insertion order doesn't matter
- **`professional_history`** — sorted at render time (current first, then by `start_date` desc); insertion order doesn't matter
- **`awards.yaml`** — newest first; not re-sorted by component
- Everything else — no enforced order; use judgment

## Common tasks

### Add a mentee

```yaml
# src/data/mentees.yaml — undergraduate or graduate list, newest first
- name: Full Name
  institution: UC Santa Cruz
  project: "Brief project description"
  period: "2015-2018" # free-text year range; use "2025-present" if ongoing
  url: "" # fill in if they have a website; leave "" otherwise
```

### Add a talk

```yaml
# src/data/talks.yaml — newest first
- type: Seminar # Seminar | Colloquium | Plenary = invited
  venue: University Name #   Parallel | Poster = contributed
  date: 2025-06 # YYYY-MM
  url: https://... # optional; omit if none
```

Invited talks (Seminar/Colloquium/Plenary) render in the left column; contributed (Parallel/Poster) in the right.

### Add a community/white paper

```yaml
# src/data/service.yaml — community_papers list; sorted by date at render time
- title: "Full paper title"
  date: 2024-11 # YYYY-MM
  url: https://arxiv.org/abs/...
  description: One-sentence summary.
```

### Add a physics analysis or instrumentation result

Find the right category in `src/data/research.yaml` (`Physics Searches`, `Higgs Physics`, `Detector Instrumentation`, etc.) and add a project entry. Minimal shape:

```yaml
- title: Project Name
  role: Your role
  subtitle: "Collaboration / lab, YYYY-YYYY"
  description: >
    What the project is and why it matters.
  links:
    - label: arXiv
      url: https://arxiv.org/abs/XXXX.XXXXX
      icon: file-text
```

Optional fields: `images`, `tags`, `timeline` (list of `{year, label, url?}`). See existing entries for examples.

### Add a software project

Same structure as research projects, but in `src/data/software.yaml`. Common `icon` values for links: `github`, `book`, `file-text`.

### Add a service role

```yaml
# src/data/service.yaml — roles list
- title: Committee or group name
  role: Your role title
  period: "2024-2025" # free-text; use "Jan 2025-present" for ongoing with known start month
  description: > # optional
    One sentence if context is needed.
```

## Interfaces

Each component defines the TypeScript interface for its YAML at the top of the frontmatter (`---` block). If a field's type or optionality is unclear, read the relevant component:

| Data file                   | Component                                  |
| --------------------------- | ------------------------------------------ |
| `mentees.yaml`              | `src/components/Teaching.astro`            |
| `talks.yaml`                | `src/components/Talks.astro`               |
| `service.yaml`              | `src/components/Service.astro`             |
| `research.yaml`             | `src/components/Research.astro`            |
| `software.yaml`             | `src/components/Software.astro`            |
| `professional_history.yaml` | `src/components/ProfessionalHistory.astro` |
| `awards.yaml`               | `src/components/Awards.astro`              |
| `teaching.yaml`             | `src/components/Teaching.astro`            |
| `media.yaml`                | `src/components/Media.astro`               |

## Validation

Run `pixi run test` after any edit to catch broken date strings. Run `pixi run build` to confirm the site builds cleanly. Run `pixi run check` to confirm everything looks ok.
