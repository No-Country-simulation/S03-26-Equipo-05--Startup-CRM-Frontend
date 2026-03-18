/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'sagrada-bg': '#f0e3d2',
        'sagrada-paper': '#fbf7f1',
        'sagrada-purple': '#694a7e',
        'sagrada-purple-dark': '#513763',
        'sagrada-gold': '#b99557',
        'sagrada-gold-hover': '#9e7d44',
      }
    },
  },
  plugins: [],
}
