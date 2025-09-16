import { PT_Serif } from "next/font/google";

// Configure PT Serif font
export const ptSerif = PT_Serif({
  source:
    "https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
});
