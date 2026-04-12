# CLAUDE.md

See [AGENTS.md](AGENTS.md) for content schemas, data file locations, date formats, ordering conventions, and common task patterns.

## Environment

```sh
pixi run install   # install npm dependencies
pixi run test      # run unit tests
pixi run build     # build static site to dist/
pixi run format    # auto-format all files
```

Always run `pixi run test` and `pixi run build` before pushing a PR.

## Issue-based content management

When triggered by a GitHub issue with the `claude-cms` label, parse the form fields from the issue body and apply the corresponding YAML edit.

GitHub issue forms render fields as:

```
### Field Label

Value
```

The hidden `<!-- @claude template: <id> -->` comment at the top of each issue body both triggers the action and identifies the template type. It's in a non-editable `markdown` field, so it's always present.

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
3. Run `pixi run test` and `pixi run build`.
4. Create a branch and PR with a title like `"feat: add mentee Jane Smith"`.
5. Include `Closes #<issue-number>` in the PR description.

### Free-form `@claude` commands

When triggered by an `@claude` mention, follow the instructions in the comment. Consult AGENTS.md for the correct file, schema, and ordering.
