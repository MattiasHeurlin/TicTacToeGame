/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        mytheme: {



          "primary": "#02cccc",



          "secondary": "#D926AA",



          "accent": "#1FB2A5",



          "neutral": "#6b7280",



          "base-100": "#1f2937",



          "info": "#3ABFF8",



          "success": "#36D399",



          "player1": "#FBBD23",



          "player2": "#ef4444",
        },
      },
    ],
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  
  plugins: [require("daisyui")],
}

