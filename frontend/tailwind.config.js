/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#3b82f6',
        accent: {
          DEFAULT: '#06b6d4',
          light: '#67e8f9',
          dark: '#0891b2',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.50)',
          'white-light': 'rgba(255, 255, 255, 0.30)',
          'white-heavy': 'rgba(255, 255, 255, 0.65)',
          border: 'rgba(255, 255, 255, 0.55)',
          'border-light': 'rgba(255, 255, 255, 0.30)',
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.08)',
        'glass-xl': '0 20px 60px rgba(0, 0, 0, 0.10)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.25)',
        'glow-teal': '0 0 20px rgba(6, 182, 212, 0.20)',
        'glow-accent': '0 4px 24px rgba(6, 182, 212, 0.18)',
        'inner-glass': 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'accent-gradient-hover': 'linear-gradient(135deg, #0891b2, #2563eb)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}