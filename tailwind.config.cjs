const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	prefix: 'nm-',
	content: [
		"./src/**/*.{js,ts}",
		'./index.html',
		'./index.js',
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
	variants: {
		extend: {
			last: ['translate-x', 'translate-y'],
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('tailwindcss-children'),
		plugin(({ addVariant }) => {
			addVariant('range-track', [
				'&::-webkit-slider-runnable-track',
				'&::-moz-range-track',
				'&::-ms-track'
			]);
			addVariant('range-thumb', [
				'&::-webkit-slider-thumb',
				'&::-moz-range-thumb',
				'&::-ms-thumb',
			]);
		}),
	],
};
