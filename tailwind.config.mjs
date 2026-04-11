/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'system-ui', 'sans-serif'],
        body: ['Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#FAFAF8',
          text: '#1a1a1a',
          accent: '#c53030',
          muted: '#6b6b6b',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
