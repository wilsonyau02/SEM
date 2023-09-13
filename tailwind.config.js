/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        '84': '21rem',
        '100': '25rem'
      },
      spacing: {
        '26': '6.5rem'
      },
      maxWidth: {
        '14': '14rem'
      },
    },
  },
  plugins: [],
};
