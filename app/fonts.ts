import { Inter, Lato, Michroma, Open_Sans, Poppins, Raleway, Roboto } from "next/font/google";

// Same Google Fonts the WordPress site renders with.
export const raleway = Raleway({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--nf-raleway", display: "swap" });
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--nf-poppins", display: "swap" });
export const michroma = Michroma({ subsets: ["latin"], weight: "400", variable: "--nf-michroma", display: "swap", preload: false });
export const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--nf-open-sans", display: "swap", preload: false });
export const inter = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--nf-inter", display: "swap", preload: false });
export const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--nf-lato", display: "swap", preload: false });
export const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"], variable: "--nf-roboto", display: "swap", preload: false });

export const fontVariables = [raleway, poppins, michroma, openSans, inter, lato, roboto].map((f) => f.variable).join(" ");
