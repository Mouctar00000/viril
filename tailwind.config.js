/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          base: '#04050A',
          DEFAULT: '#04050A',
          surface: '#0A0C16',
          hover: '#121522',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.2)',
          borderAccent: 'rgba(209, 185, 146, 0.4)',
        },
        goldAccent: {
          DEFAULT: '#D1B992',
          glow: 'rgba(209, 185, 146, 0.22)',
          hover: '#DFCAA0',
          dark: '#C7AE84',
        },
        cyanAccent: {
          DEFAULT: '#D1B992',
          glow: 'rgba(209, 185, 146, 0.22)',
          hover: '#DFCAA0',
          dark: '#C7AE84',
        },
        textMuted: '#5E6479',
        textSecondary: '#9AA0B4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(209, 185, 146, 0.4)',
        'cyan-glow': '0 0 25px -5px rgba(209, 185, 146, 0.4)',
        'cyan-subtle': '0 0 15px -3px rgba(209, 185, 146, 0.25)',
        'surface-card': '0 10px 30px rgba(0, 0, 0, 0.4)',
      },
      transitionTimingFunction: {
        'ease-custom': 'cubic-bezier(.16, 1, .3, 1)',
        'ease-soft': 'cubic-bezier(.4, 0, .2, 1)',
      }
    },
  },
  plugins: [],
}
