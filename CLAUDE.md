# CLAUDE.md

See [AGENTS.md](AGENTS.md) for content schemas, data file locations, date formats, ordering conventions, and common task patterns.

## Environment

```sh
pixi run install        # install npm dependencies
pixi run format .       # auto-format all files
pixi run check          # format-check + lint + test + build (run before pushing)
```

## Issue-based content management

When triggered by a GitHub issue carrying the `claude` label (applied automatically by issue templates), parse the form fields and apply the corresponding YAML edit. The workflow routes to the right YAML target using the template-specific label (`mentee`, `talk`, `community-paper`, `award`, `service`, `outreach`).

GitHub issue forms render fields as:

```
### Field Label

Value
```

### Template routing

| Template              | YAML target                                                                 | Ordering                              |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| `add-mentee`          | `src/data/mentees.yaml` → `undergraduate` or `graduate` (per `level` field) | Newest first                          |
| `add-talk`            | `src/data/talks.yaml` → `talks`                                             | Newest first                          |
| `add-community-paper` | `src/data/service.yaml` → `community_papers`                                | Any (sorted at render time by `date`) |
| `add-award`           | `src/data/awards.yaml` → `awards`                                           | Newest first                          |
| `add-service-role`    | `src/data/service.yaml` → `roles`                                           | Append                                |
| `add-outreach`        | `src/data/service.yaml` → `outreach`                                        | Append                                |

### PR workflow

1. Parse form fields from issue body.
2. Read the target YAML file and add the new entry per the ordering rule above.
3. Run `pixi run format .` to format any changed files.
4. Run `pixi run check` to validate (format-check, lint, tests, full build).
5. Create a branch and PR with a title like `"feat: add mentee Jane Smith"`.
6. Include `Closes #<issue-number>` in the PR description.

### Free-form `@claude` commands

When triggered by an `@claude` mention, follow the instructions in the comment. Consult AGENTS.md for the correct file, schema, and ordering.
