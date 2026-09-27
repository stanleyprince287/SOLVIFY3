import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1E3A8A", 600: "#1D4ED8", 700: "#1E40AF" },
        success: "#16A34A",
        warning: "#F59E0B",
        danger:  "#DC2626",
        bg:      "#F8FAFC",
        ink:     "#1F2937"
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
} satisfies Config;