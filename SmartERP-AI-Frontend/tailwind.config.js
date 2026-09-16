/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'], // headings use Inter 700 via CSS
      },
      fontWeight: {
        heading: '700',
        subheading: '600',
        body: '400',
        button: '500',
        'button-strong': '600',
        nav: '500',
      },
    },
  },
  plugins: [],
}
