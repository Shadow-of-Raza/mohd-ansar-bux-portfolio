import { Archivo_Black, Abhaya_Libre, Alegreya_SC, Averia_Serif_Libre } from "next/font/google";

export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
});

export const abhayaLibre = Abhaya_Libre({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-abhaya-libre",
});

export const alegreyaSC = Alegreya_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alegreya-sc",
});

export const averiaSerif = Averia_Serif_Libre({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-averia-serif-libre",
});

export const fontVariables = [archivoBlack, abhayaLibre, alegreyaSC, averiaSerif]
  .map((f) => f.variable)
  .join(" ");
