# giordonstark.com

Personal academic website for Giordon Stark — Deaf project scientist and experimental particle physicist at UCSC/ATLAS.

## Stack

- **[Astro](https://astro.build)** — static site generator, zero JS by default
- **[Tailwind CSS v3](https://tailwindcss.com)** — utility-first styling with a custom warm-off-white/brand-accent theme
- **[GSAP + ScrollTrigger](https://gsap.com)** — scroll-driven proton-proton collision canvas animation in the hero
- **[pixi](https://pixi.sh)** — manages the Node.js environment via conda-forge

## Development

Tasks are defined in `pixi.toml` and self-documented — run `pixi task list` to see all available tasks with their descriptions. Key ones:

```
pixi run dev           # start dev server (runs install first if needed)
pixi run build         # build to dist/ (cached: reruns only when sources change)
pixi run preview       # serve the production build locally
pixi run format        # auto-format with Prettier
pixi run format-check  # check formatting without writing (for CI)
pixi run lint          # lint Astro components
```

`build` and `install` have `inputs`/`outputs` configured so pixi skips them when nothing has changed.

## Content

All content lives in YAML files under `src/data/`. To update any section, edit the corresponding file and rebuild.

| File                           | Section                                                                |
| ------------------------------ | ---------------------------------------------------------------------- |
| `src/data/social.yaml`         | Social links in the About section                                      |
| `src/data/research.yaml`       | Research & Instrumentation cards (physics searches, detector hardware) |
| `src/data/software.yaml`       | Software & Open Source cards, grouped by category                      |
| `src/data/awards.yaml`         | Awards list                                                            |
| `src/data/teaching.yaml`       | Teaching highlights, workshops, courses                                |
| `src/data/media.yaml`          | Media/online presence items                                            |
| `src/data/service.yaml`        | Service roles, outreach, American Red Cross history                    |
| `src/data/talks.yaml`          | Prior talks list                                                       |
| `src/data/talk_abstracts.yaml` | Invited talk abstracts and speaker bio                                 |
| `src/data/interpreting.yaml`   | Numbered interpreter info items                                        |
| `src/data/mentees.yaml`        | Undergraduate and graduate mentees                                     |

### Adding a research or software card

Each entry in `research.yaml` and `software.yaml` supports an optional `images` field:

```yaml
images:
  - img/research/my-plot.png # single image: renders as a hero image above the card
  - img/research/result-2.png # multiple images: renders as a carousel
```

Place image files in `public/img/research/` or `public/img/software/`. Leave `images: []` (or omit the field) to show no image.

### Updating social links

Edit `src/data/social.yaml`. The `icon` field must be one of: `github`, `bluesky`, `mastodon`, `facebook`. The `rel` field (optional) is appended to `noopener` — use `me` for rel-me verification links (e.g. Mastodon).

## Collision Animation

The particle collision canvas (`src/scripts/collision.ts`) is a scroll-driven GSAP animation tied to the `#about` section. Three phases:

1. **Approach** (0–40% scroll): two proton bunches move from the edges toward center with per-particle scroll-driven wiggle
2. **Collision** (40–45% scroll): brief bright burst at center
3. **Tracks** (45–100% scroll): curved particle tracks spray outward from the collision point

Particle counts and track counts scale down on mobile (see `particleCount()` / `trackCount()`). The canvas is `aria-hidden` — all content is fully readable without it.

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via `.github/workflows/deploy.yml`. The custom domain is set by `public/CNAME`.

## Profile image

To resize and compress a new profile photo:

```bash
convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -define jpeg:dct-method=float profile.jpg resized.jpg
convert profile.jpg -resize 160x160\> resized.jpg
```
