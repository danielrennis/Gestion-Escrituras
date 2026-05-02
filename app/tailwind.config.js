/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
      extend: {
          "colors": {
              "tertiary-fixed": "#fcdeb5",
              "error-container": "#93000a",
              "surface-bright": "#39393b",
              "on-secondary-fixed": "#002113",
              "surface-container-low": "#1b1b1d",
              "inverse-primary": "#565e74",
              "primary": "#bec6e0",
              "surface-variant": "#353436",
              "secondary-container": "#00a572",
              "background": "#131315",
              "surface-container-lowest": "#0e0e10",
              "error": "#ffb4ab",
              "on-tertiary": "#3e2d11",
              "on-primary-fixed": "#131b2e",
              "inverse-surface": "#e4e2e4",
              "outline-variant": "#45464d",
              "surface-dim": "#131315",
              "surface": "#131315",
              "tertiary-container": "#231500",
              "secondary": "#4edea3",
              "tertiary-fixed-dim": "#dec29a",
              "on-background": "#e4e2e4",
              "on-tertiary-container": "#957d5a",
              "on-primary-fixed-variant": "#3f465c",
              "primary-fixed-dim": "#bec6e0",
              "outline": "#909097",
              "on-primary": "#283044",
              "on-surface-variant": "#c6c6cd",
              "primary-container": "#0f172a",
              "on-secondary": "#003824",
              "primary-fixed": "#dae2fd",
              "on-error-container": "#ffdad6",
              "on-primary-container": "#798098",
              "on-tertiary-fixed": "#271901",
              "on-surface": "#e4e2e4",
              "on-tertiary-fixed-variant": "#574425",
              "on-error": "#690005",
              "surface-container": "#1f1f21",
              "inverse-on-surface": "#303032",
              "secondary-fixed": "#6ffbbe",
              "surface-tint": "#bec6e0",
              "secondary-fixed-dim": "#4edea3",
              "on-secondary-fixed-variant": "#005236",
              "surface-container-highest": "#353436",
              "surface-container-high": "#2a2a2b",
              "tertiary": "#dec29a",
              "on-secondary-container": "#00311f"
          },
          "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
          },
          "spacing": {
              "unit": "4px",
              "gutter": "12px",
              "density": "compact",
              "margin": "16px",
              "container-padding": "12px"
          },
          "fontFamily": {
              "headline-xl": ["Inter", "sans-serif"],
              "label-caps": ["Inter", "sans-serif"],
              "body-xs": ["Inter", "sans-serif"],
              "body-sm": ["Inter", "sans-serif"],
              "headline-md": ["Inter", "sans-serif"],
              "data-mono": ["monospace"]
          },
          "fontSize": {
              "headline-xl": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
              "label-caps": ["11px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700" }],
              "body-xs": ["12px", { "lineHeight": "16px", "fontWeight": "400" }],
              "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
              "headline-md": ["18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
              "data-mono": ["13px", { "lineHeight": "18px", "fontWeight": "500" }]
          }
      }
  },
  plugins: [],
}
