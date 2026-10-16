/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
  printWidth: 110,
  singleQuote: false,
  semi: true,
  trailingComma: "all",
};

export default config;
