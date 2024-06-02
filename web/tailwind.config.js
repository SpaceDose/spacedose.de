/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: '#00000000',
      black: '#242629',
      gray: '#A2A2A2',
      orange: {
        light: '#FDF0E7',
        DEFAULT: '#E88E51',
        dark: '#B3571A',
      },
      green: {
        light: '#C9D69D',
        DEFAULT: '#9EB353',
        dark: '#5C6830',
      },
      purple: {
        light: '#BEAFD8',
        DEFAULT: '#8368B1',
        dark: '#4F3C70',
      },
    },
    extend: {},
  },
  plugins: [],
};
