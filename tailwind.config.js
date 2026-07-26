/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        canvas: '#FAFAF8',
        champagne: '#C8A96B',
        champagneLight: '#E2C995',
        muted: '#666666',
      },
      boxShadow: {
        card: '0 20px 60px rgba(17, 17, 17, 0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(8px, -8px) rotate(1deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 700ms ease-out both',
        'rise-in': 'riseIn 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
