import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			keyframes: {
				shimmer: {
					"0%": { backgroundPosition: "200% 0" },
					"100%": { backgroundPosition: "-200% 0" },
				},
			},
			animation: {
				shimmer: "shimmer 2s infinite linear",
			},
			colors: {
				// Temu-inspired orange color scheme
				temu: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#FB7701', // Primary Temu orange
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
				primary: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#FB7701', // Temu orange
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
				secondary: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444', // Red for sale badges
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
				},
			},
		},
	},
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
};

export default config;
