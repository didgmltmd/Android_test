import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        toss: {
          bg: "#F9FAFB",
          blue: "#3182F6",
          text: "#111827",
          muted: "#6B7280",
          line: "#E5E7EB",
          soft: "#F3F7FD",
          panel: "#F8FAFC",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 24, 39, 0.06)",
      },
      maxWidth: {
        "screen-6xl": "1200px",
      },
    },
  },
  plugins: [],
} satisfies Config;
