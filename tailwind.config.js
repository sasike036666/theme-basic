/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  darkMode: 'class', // 启用 class 模式的暗色主题
=======
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
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

