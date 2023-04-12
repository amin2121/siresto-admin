/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", 'node_modules/daisyui/dist/**/*.js', 'node_modules/react-daisyui/dist/**/*.js'],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#081A51",
        "light-white": "#F2F4F6",
        "custom-blue":"#3375F5",
        "border-light": "#EFECEC"
      }
    },
  },
  daisyui: {
     // themes: ["emerald"],
  },
  plugins: [require('daisyui')],
}
