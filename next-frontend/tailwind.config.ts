import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003366', // Deep blue (trust)
          dark: '#001A33',
        },
        success: {
          DEFAULT: '#007A3D', // Emerald (growth)
        },
        warning: {
          DEFAULT: '#FFC400', // Amber (optimism)
        },
        card: '#F7F9FC',
        accent: '#E5EFFF',
        // Brand palette - WCAG AA compliant variants
        brandMint: {
          light: '#A8E6CF',
          DEFAULT: '#2E7D32', // Much darker green for WCAG AA compliance
          dark: '#1B5E20',
        },
        brandRose: {
          light: '#FFB5B5',
          DEFAULT: '#C62828', // Much darker red for WCAG AA compliance
          dark: '#B71C1C',
        },
        // Semantic tokens
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        mono: defaultTheme.fontFamily.mono,
      },
      borderRadius: {
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
      },
      boxShadow: {
        'elev-1': '0 2px 8px 0 rgba(0, 51, 102, 0.04)',
        'elev-2': '0 4px 24px 0 rgba(0, 51, 102, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};

export default config; 