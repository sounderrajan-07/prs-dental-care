/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#113a76",
        "primary-container": "#2f528f",
        "on-primary": "#ffffff",
        "on-primary-container": "#adc7ff",
        "primary-fixed-dim": "#adc7ff",
        "secondary": "#735c00",
        "secondary-container": "#fed65b",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#745c00",
        "tertiary": "#583400",
        "tertiary-container": "#784800",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "surface": "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-ice": "#F8FAFC",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#434750",
        "outline": "#747781",
        "outline-variant": "#c4c6d1",
        "success-teal": "#0D9488",
        "info-sky": "#E0F2FE",
        "error": "#ba1a1a",
        "error-container": "#ffdad6"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        caption: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      }
    },
  },
  plugins: [],
}
