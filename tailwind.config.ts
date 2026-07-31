import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ── Colour tokens ───────────────────────────────────────────
      colors: {
        ink: "#1a1a1a",
        canvas: "#f7f6f3",
        paper: "#ffffff",
        line: "#e6e3dd",
        muted: "#6b6b6b",
        accent: "#9a3b2e",
        "accent-soft": "#f0e6e3",
      },

      // ── Font families ────────────────────────────────────────────
      // font-sans  → Nexa Light  (body, UI, captions)
      // font-bold  → Nexa Bold   (headings, display, labels)
      fontFamily: {
        sans:    ["var(--font-nexa-light)", "Helvetica Neue", "Arial", "sans-serif"],
        bold:    ["var(--font-nexa-bold)",  "Helvetica Neue", "Arial", "sans-serif"],
        // legacy aliases kept for any remaining admin components
        display: ["var(--font-nexa-bold)",  "Helvetica Neue", "Arial", "sans-serif"],
      },

      // ── Type scale ───────────────────────────────────────────────
      // Values match the .type-* classes in globals.css exactly.
      // Use these tokens for one-off overrides; prefer .type-* classes.
      fontSize: {
        "10": ["0.625rem",  { lineHeight: "1" }],
        "11": ["0.6875rem", { lineHeight: "1" }],
        "12": ["0.75rem",   { lineHeight: "1.5" }],
        "13": ["0.8125rem", { lineHeight: "1.4" }],
        "14": ["0.875rem",  { lineHeight: "1.6" }],
        "15": ["0.9375rem", { lineHeight: "1.65" }],
        "16": ["1rem",      { lineHeight: "1.65" }],
        "18": ["1.125rem",  { lineHeight: "1.55" }],
        "20": ["1.25rem",   { lineHeight: "1.45" }],
        "24": ["1.5rem",    { lineHeight: "1.3" }],
        "28": ["1.75rem",   { lineHeight: "1.25" }],
        "32": ["2rem",      { lineHeight: "1.15" }],
        "36": ["2.25rem",   { lineHeight: "1.1" }],
        "40": ["2.5rem",    { lineHeight: "1.05" }],
        "48": ["3rem",      { lineHeight: "1" }],
        "56": ["3.5rem",    { lineHeight: "0.96" }],
        "64": ["4rem",      { lineHeight: "0.93" }],
        "72": ["4.5rem",    { lineHeight: "0.92" }],
        "80": ["5rem",      { lineHeight: "0.91" }],
        "96": ["6rem",      { lineHeight: "0.9" }],
        "120": ["7.5rem",   { lineHeight: "0.88" }],
        "160": ["10rem",    { lineHeight: "0.86" }],
      },

      // ── Letter spacing ───────────────────────────────────────────
      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.03em",
        tight:    "-0.02em",
        snug:     "-0.015em",
        DEFAULT:  "0",
        wide:     "0.04em",
        wider:    "0.1em",
        widest:   "0.2em",
        ultra:    "0.25em",
      },

      // ── Animations ───────────────────────────────────────────────
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee:  "marquee 24s linear infinite",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
      },

      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
