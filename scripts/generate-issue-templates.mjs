/**
 * Generates .github/ISSUE_TEMPLATE/*.yml from TypeScript interfaces defined
 * in Astro component frontmatter.
 *
 * Uses ts-morph (TypeScript compiler API wrapper) to parse interfaces from
 * source — no regex, no string matching. Run via `pixi run generate-issue-templates`.
 *
 * Drift detection: if a fieldOverride references a field that no longer exists
 * in the interface, the script exits with an error. CI runs this and checks
 * `git diff --exit-code .github/ISSUE_TEMPLATE/` to catch uncommitted changes.
 */

import { Project } from "ts-morph";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { dump } from "js-yaml";

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Interface extraction via ts-morph
// ---------------------------------------------------------------------------

/** Extract TypeScript frontmatter from an .astro file (between the first ---). */
function extractFrontmatter(filePath) {
  const content = readFileSync(resolve(ROOT, filePath), "utf8");
  // Strip import lines — they won't resolve in an in-memory project
  return content.split("---")[1]?.replace(/^import\s.+$/gm, "") ?? "";
}

/** Return all properties of a named interface in the given TypeScript source. */
function getInterfaceProps(tsSource, interfaceName) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { strict: false, noResolve: true, skipLibCheck: true },
  });
  const sourceFile = project.createSourceFile("temp.ts", tsSource);
  const iface = sourceFile.getInterface(interfaceName);
  if (!iface) {
    throw new Error(`Interface "${interfaceName}" not found in source`);
  }
  return iface.getProperties().map((prop) => ({
    name: prop.getName(),
    optional: prop.hasQuestionToken(),
    typeText: prop.getTypeNode()?.getText() ?? "string",
  }));
}

// ---------------------------------------------------------------------------
// Template registry
// Each entry defines: id, title, description, labels, component file,
// interface name, optional extraFields (non-interface form fields inserted
// first), and fieldOverrides (per-field label/placeholder/description/type).
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    id: "add-mentee",
    title: "Add Mentee",
    description: "Add an undergraduate or graduate mentee to the website.",
    labels: ["mentee"],
    component: "src/components/Teaching.astro",
    interfaceName: "Mentee",
    // level is a routing field — not part of the interface, inserted first
    extraFields: [
      {
        type: "dropdown",
        id: "level",
        attributes: {
          label: "Level",
          description: "Determines which list the mentee appears under.",
          options: ["undergraduate", "graduate"],
        },
        validations: { required: true },
      },
    ],
    fieldOverrides: {
      name: { label: "Full name", placeholder: "e.g. Jane Smith" },
      institution: { placeholder: "e.g. UC Santa Cruz" },
      project: { label: "Project description", fieldType: "textarea" },
      period: {
        placeholder: "e.g. 2025-present or 2022-2025",
        description: "Free-text year range.",
      },
      url: {
        label: "Website URL",
        placeholder: "https://...",
        description: "Personal or academic website. Leave blank if none.",
      },
    },
  },

  {
    id: "add-talk",
    title: "Add Talk",
    description: "Add a new talk to the talks list.",
    labels: ["talk"],
    component: "src/components/Talks.astro",
    interfaceName: "Talk",
    extraFields: [],
    fieldOverrides: {
      type: {
        label: "Talk type",
        fieldType: "dropdown",
        options: ["Seminar", "Colloquium", "Plenary", "Parallel", "Poster"],
        description:
          "Seminar / Colloquium / Plenary = invited; Parallel / Poster = contributed.",
      },
      venue: { placeholder: "e.g. University of Hawaii" },
      date: {
        placeholder: "YYYY-MM",
        description:
          "Machine-parseable format (e.g. 2025-06). Used for sorting and display.",
      },
      url: {
        label: "URL",
        placeholder: "https://...",
        description: "Link to slides or event page. Optional.",
      },
    },
  },

  {
    id: "add-community-paper",
    title: "Add Community Paper",
    description: "Add a community or white paper to the Service section.",
    labels: ["community-paper"],
    component: "src/components/Service.astro",
    interfaceName: "CommunityPaper",
    extraFields: [],
    fieldOverrides: {
      title: { label: "Paper title" },
      date: {
        placeholder: "YYYY-MM",
        description: "Publication month (e.g. 2024-11). Used for sorting.",
      },
      url: {
        label: "URL",
        placeholder: "https://arxiv.org/abs/...",
        description: "arXiv, DOI, or other canonical link. Optional.",
      },
      description: {
        label: "Description",
        fieldType: "textarea",
        placeholder: "One-sentence summary.",
        description: "Optional.",
      },
    },
  },

  {
    id: "add-award",
    title: "Add Award",
    description: "Add an award or honor.",
    labels: ["award"],
    component: "src/components/Awards.astro",
    interfaceName: "Award",
    extraFields: [],
    fieldOverrides: {
      name: { label: "Award name" },
      date: {
        placeholder: "e.g. May 2025 or 2019",
        description: "Free-text date (month + year, or year only).",
      },
      description: {
        label: "Description",
        fieldType: "textarea",
        description: "Optional longer description.",
      },
      citation: {
        label: "Citation text",
        fieldType: "textarea",
        description: "Optional award citation.",
      },
      url: {
        label: "URL",
        placeholder: "https://...",
        description: "Optional link.",
      },
    },
  },

  {
    id: "add-service-role",
    title: "Add Service Role",
    description: "Add an academic or community service role.",
    labels: ["service"],
    component: "src/components/Service.astro",
    interfaceName: "Role",
    extraFields: [],
    fieldOverrides: {
      title: { label: "Committee / group name" },
      role: { label: "Your role", placeholder: "e.g. Committee Member" },
      period: {
        placeholder: "e.g. 2024-2025 or Jan 2025-present",
        description: "Free-text period.",
      },
      description: {
        label: "Description",
        fieldType: "textarea",
        description: "Optional one-sentence context.",
      },
    },
  },

  {
    id: "add-outreach",
    title: "Add Outreach Activity",
    description: "Add an outreach or advocacy activity to the Service section.",
    labels: ["outreach"],
    component: "src/components/Service.astro",
    interfaceName: "Outreach",
    extraFields: [],
    fieldOverrides: {
      title: { label: "Activity title" },
      period: {
        placeholder: "e.g. 2024 or Sep 2023",
        description: "Free-text date or range.",
      },
      url: {
        label: "URL",
        placeholder: "https://...",
        description: "Optional link.",
      },
      description: {
        label: "Description",
        fieldType: "textarea",
        description: "Optional description.",
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Form field builders
// ---------------------------------------------------------------------------

const MULTILINE_FIELD_NAMES = new Set([
  "description",
  "citation",
  "abstract",
  "bullets",
  "project",
]);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

/**
 * Build a single GitHub issue form field from an interface property and its
 * optional override config.
 */
function buildFormField(prop, override = {}) {
  const { name, optional } = prop;
  const {
    label = capitalize(name),
    description,
    placeholder,
    fieldType,
    options,
  } = override;

  const resolvedType =
    fieldType ??
    (options
      ? "dropdown"
      : MULTILINE_FIELD_NAMES.has(name)
        ? "textarea"
        : "input");

  const attributes = { label };
  if (description) attributes.description = description;
  if (placeholder && resolvedType !== "dropdown")
    attributes.placeholder = placeholder;
  if (options) attributes.options = options;

  return {
    type: resolvedType,
    id: name,
    attributes,
    validations: { required: !optional },
  };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Error if fieldOverrides references a field not in the interface —
 * this means the interface was changed and the override is now stale.
 */
function validateOverrides(props, fieldOverrides, templateId) {
  const propNames = new Set(props.map((p) => p.name));
  const stale = Object.keys(fieldOverrides).filter((n) => !propNames.has(n));
  if (stale.length > 0) {
    console.error(
      `[${templateId}] fieldOverrides references fields not in interface: ${stale.join(", ")}\n` +
        `  Update the registry in scripts/generate-issue-templates.mjs.`,
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const OUTPUT_DIR = resolve(ROOT, ".github/ISSUE_TEMPLATE");
mkdirSync(OUTPUT_DIR, { recursive: true });

const GENERATED_HEADER =
  "# Generated by scripts/generate-issue-templates.mjs\n" +
  "# Run `pixi run generate-issue-templates` to regenerate.\n\n";

// config.yml
writeFileSync(
  resolve(OUTPUT_DIR, "config.yml"),
  GENERATED_HEADER + dump({ blank_issues_enabled: true }),
);
console.log("✓ config.yml");

for (const template of TEMPLATES) {
  const tsSource = extractFrontmatter(template.component);
  const props = getInterfaceProps(tsSource, template.interfaceName);
  validateOverrides(props, template.fieldOverrides, template.id);

  const body = [
    // Hidden comment — triggers the @claude action condition and carries the
    // template id for routing (see CLAUDE.md). Invisible in rendered view.
    {
      type: "markdown",
      attributes: { value: `<!-- @claude template: ${template.id} -->` },
    },
    ...template.extraFields,
    ...props.map((prop) =>
      buildFormField(prop, template.fieldOverrides[prop.name]),
    ),
  ];

  const issueTemplate = {
    name: template.title,
    description: template.description,
    labels: template.labels,
    body,
  };

  writeFileSync(
    resolve(OUTPUT_DIR, `${template.id}.yml`),
    GENERATED_HEADER + dump(issueTemplate, { lineWidth: -1 }),
  );
  console.log(`✓ ${template.id}.yml`);
}

console.log("\nDone. Commit .github/ISSUE_TEMPLATE/ if any files changed.");
