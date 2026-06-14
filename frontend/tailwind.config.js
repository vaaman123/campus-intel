/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0a0a0f",
          soft: "#12121a",
          muted: "#1c1c28",
        },
        fog: {
          DEFAULT: "#e8e6f0",
          dim: "#9d9ab0",
          faint: "#3a3850",
        },
        spark: {
          DEFAULT: "#7c6af5",
          bright: "#a594ff",
          dim: "#3d3480",
        },
        jade: "#2dd4a0",
        amber: "#f5a623",
        rose: "#f56b8a",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseDot: { "0%, 80%, 100%": { opacity: 0.3, transform: "scale(0.8)" }, "40%": { opacity: 1, transform: "scale(1)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
