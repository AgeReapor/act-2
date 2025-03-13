/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
    safelist: [],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {},
    },
    plugins: [],
};
