/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'bg-base': 'var(--color-bg-base)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
      }
    },
  },
  plugins: [],
}
