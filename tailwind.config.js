/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: [
		"./src/**/*.{js,ts}",
		'./index.html',
	],
	darkMode: 'media',
	theme: {
		extend: {
			width: {
				available: [
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
			height: {
				available: [
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
			minHeight: {
				available: [
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
			maxHeight: {
				available: [
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
		},
	},
	plugins: [
	],
};
