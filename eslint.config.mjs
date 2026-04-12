// eslint.config.js
import { defineConfig } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";
import eslintPluginAstro from "eslint-plugin-astro";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  {
    ignores: ["public/**"]
  },
  // Use .gitignore
  includeIgnoreFile(gitignorePath),

  // Astro recommended config
  ...eslintPluginAstro.configs.recommended,

  // addtional custom rules
  {
    rules: {
      // Allow unused variables prefixed with _ (common in Astro frontmatter)
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);
