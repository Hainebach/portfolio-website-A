import { PT_Serif } from "next/font/google";

// Configure PT Serif font
export const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
});
