/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        turquoise: "#40E0D0",
        'theme-purple': {
          icon: '#7F77DD',
          text: '#534AB7',
          ring: 'rgba(127,119,221,0.25)'
        },
        'theme-teal': {
          icon: '#1D9E75',
          text: '#0F6E56',
          ring: 'rgba(29,158,117,0.2)'
        },
        'theme-coral': {
          icon: '#D85A30',
          text: '#993C1D',
          ring: 'rgba(216,90,48,0.2)'
        }
      },
    },
  },
  plugins: [],
}

