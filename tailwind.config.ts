import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '320px',   // iPhone SE, très petits téléphones
        'xs': '375px',    // iPhone 12 mini, petits téléphones
        'sm': '640px',    // Tablettes petites
        'md': '768px',    // Tablettes standard
        'lg': '1024px',   // Desktop petit
        'xl': '1280px',   // Desktop standard
        '2xl': '1536px',  // Desktop large
        // Breakpoints spécifiques pour mobiles
        'mobile-xs': { 'max': '374px' },     // Très petits mobiles uniquement
        'mobile-sm': { 'min': '375px', 'max': '639px' }, // Mobiles standards
        'tablet': { 'min': '640px', 'max': '1023px' },   // Tablettes
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '0.25': '0.0625rem',  // 1px
        '0.75': '0.1875rem',  // 3px
        '1.25': '0.3125rem',  // 5px
        '2.25': '0.5625rem',  // 9px
        '3.25': '0.8125rem',  // 13px
        '4.25': '1.0625rem',  // 17px
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.75rem' }],  // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'tiny': ['0.6875rem', { lineHeight: '0.875rem' }], // 11px
        'micro': ['0.5625rem', { lineHeight: '0.6875rem' }], // 9px
      },
      colors: {
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
}

export default config