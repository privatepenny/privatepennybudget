/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark1': 'var(--dark1)',
        'dark2': 'var(--dark2)',
        'dark3': 'var(--dark3)',
        'light1': 'var(--light1)',
        'light2': 'var(--light2)',
        'light3': 'var(--light3)',
        'button': 'var(--button)',
        'buttonHover': 'var(--buttonHover)',
        'button2': 'var(--button2)',
        'buttonHover2': 'var(--buttonHover2)',
        'bodyTextDark': 'var(--bodyTextDark)',
        'bodyTextLight': 'var(--bodyTextLight)',
        'formInput': 'var(--formInput)',
        'formInputDenied': 'var(--formInputDenied)',
        'warningColor': 'var(--warningColor)',
        'warningText': 'var(--warningText)',
        'navbarHover': 'var(--navbarHover)',
        'progressBar': 'var(--progressBar)',
      },
    },
  },
  plugins: [],
};