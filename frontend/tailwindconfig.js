/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./node_modules/flowbite-react/**/*.js", // for flowbite-react
      "./node_modules/flowbite/**/*.js", // fallback for raw flowbite
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('flowbite/plugin'),
    ],
  };
  