import { PT_Serif } from "next/font/google";

// Primary approach with Next.js fonts
export const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
});

// Alternative approach - direct font face declarations
export const ptSerifFallback = `
@import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --font-pt-serif-fallback: 'PT Serif', serif;
}
`;

// Debug log to verify font loading
console.log("Font configuration:", {
  className: ptSerif.className,
  variable: ptSerif.variable,
  style: ptSerif.style,
});
