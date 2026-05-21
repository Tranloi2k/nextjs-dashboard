import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-inter)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-md': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        shop: {
          bg: '#FAFAF9',
          surface: '#FFFFFF',
          'surface-muted': '#F5F5F4',
          'surface-elevated': '#FFFFFF',
          text: '#0A0A0A',
          secondary: '#525252',
          muted: '#A3A3A3',
          border: '#E7E5E4',
          'border-subtle': '#F0EEEC',
          accent: '#0A0A0A',
          'accent-hover': '#262626',
          success: '#16A34A',
          error: '#DC2626',
          sale: '#B91C1C',
        },
      },
      boxShadow: {
        shop: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'shop-md': '0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 6px -2px rgb(0 0 0 / 0.04)',
        'shop-lg': '0 12px 32px -8px rgb(0 0 0 / 0.08), 0 4px 12px -4px rgb(0 0 0 / 0.04)',
        'shop-hover': '0 8px 24px -6px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.04)',
      },
      borderRadius: {
        shop: '0.375rem',
        'shop-lg': '0.5rem',
      },
      transitionDuration: {
        shop: '280ms',
      },
      transitionTimingFunction: {
        shop: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
