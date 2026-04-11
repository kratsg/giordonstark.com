import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // Allow unused variables prefixed with _ (common in Astro frontmatter)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
