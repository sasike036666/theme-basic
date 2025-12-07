/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 启用 class 模式的暗色主题
  content: [
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('flowbite/plugin'),
    require('@tailwindcss/typography'),
  ],
}

