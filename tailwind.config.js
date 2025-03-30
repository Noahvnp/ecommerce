/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
};

export default config;
