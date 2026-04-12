# giordonstark.com

Giordon Stark's personal site — particle physicist, ATLAS/CERN, UC Santa Cruz.

## Stack

- [Astro](https://astro.build): static site generator, ships zero JS by default
- [Tailwind CSS v4](https://tailwindcss.com): utility-first styling; theme tokens live in `src/styles/global.css`
- [GSAP + ScrollTrigger](https://gsap.com): the proton-proton collision animation in the hero
- [pixi](https://pixi.sh): manages the Node.js toolchain via conda-forge

## Development

Run `pixi task list` to see all tasks with descriptions.

## Content

Everything is YAML under `src/data/`. Edit the file, rebuild, done.

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

`research.yaml` and `software.yaml` both support an optional `images` field:

```yaml
images:
  - img/research/my-plot.png # single image shows as a card header
  - img/research/result-2.png # multiple images become a carousel
```

Drop files in `public/img/research/` or `public/img/software/`. Omit `images` entirely if you don't want one.

### Updating social links

Edit `src/data/social.yaml`. `icon` must be one of: `github`, `bluesky`, `mastodon`, `facebook`. The `rel` field is optional — set it to `me` for rel-me verification (Mastodon needs this).

## Collision animation

`src/scripts/collision.ts` is a scroll-linked canvas animation over the About section. Three phases:

1. Approach (0–40%): two proton bunches close in from the edges, each particle wiggling independently with scroll position
2. Collision (40–45%): brief flash at center
3. Tracks (45–100%): curved particle tracks spray outward

Mobile gets fewer particles — see `particleCount()` and `trackCount()`. The canvas is `aria-hidden`.

## Deployment

Push to `main` and it deploys to GitHub Pages via `.github/workflows/deploy.yml`. Custom domain is in `public/CNAME`.

## Profile image

To resize and compress a new photo:

```bash
convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -define jpeg:dct-method=float profile.jpg resized.jpg
convert profile.jpg -resize 160x160\> resized.jpg
```
