/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode: "media", // Automatically follows system preference - DISABLED for now
  theme: {
    extend: {
      colors: {
        "text-primary": "rgb(var(--foreground-rgb))",
        "text-secondary": "rgb(var(--secondary-gray))",
        backgroundColor: "rgb(var(--background-rgb))",
      },
      screens: {
        xl2: "1430px", // custom breakpoint for title
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        mono: ["var(--font-space_mono)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "rgb(var(--secondary-gray))",
            h1: {
              color: "rgb(var(--foreground-rgb))",
            },
            h2: {
              color: "rgb(var(--foreground-rgb))",
            },
            h3: {
              color: "rgb(var(--foreground-rgb))",
            },
            h4: {
              color: "rgb(var(--foreground-rgb))",
            },
            strong: {
              color: "rgb(var(--foreground-rgb))",
            },
            a: {
              color: "rgb(var(--secondary-gray))",
              "&:hover": {
                color: "rgb(var(--foreground-rgb))",
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")({
      className: "prose",
      target: "modern",
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
    require("@tailwindcss/aspect-ratio"),
  ],
};
