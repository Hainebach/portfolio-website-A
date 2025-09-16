import { PT_Serif } from "next/font/google";

// Configure PT Serif font
export const ptSerif = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
});

// Debug log to verify font loading
console.log("Font configuration:", {
  className: ptSerif.className,
  variable: ptSerif.variable,
  style: ptSerif.style,
});
