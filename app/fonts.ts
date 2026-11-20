import { Inter, Poppins } from "next/font/google";

// Two families only (redesign): Poppins for headings, Inter for body/UI.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-poppins",
  display: "swap",
});
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-inter",
  display: "swap",
});

export const fontVariables = [poppins, inter].map((f) => f.variable).join(" ");
