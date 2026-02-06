/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind colors to CSS variables
        // Using rgb wrapper to allow opacity modifiers in Tailwind (e.g., bg-brand/50)
        brand: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        },
        // Semantic overrides
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        // Background overrides
        background: 'rgb(var(--color-bg-main) / <alpha-value>)',
        card: 'rgb(var(--color-bg-card) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}
