// import konstaConfig config
const konstaConfig = require('konsta/config');

/** @type {import('tailwindcss').Config} */
module.exports = konstaConfig({
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ["forest"],
    base: true,
    styled: true,
    utils: true,
    logs: true
  }
});
