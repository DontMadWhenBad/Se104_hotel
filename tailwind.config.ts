import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        'primary-dark': '#0052A3',
        'primary-light': '#E6F2FF',
        secondary: '#F0F4F8',
        accent: '#00D4FF',
        success: '#10B981',
        neutral: '#6B7280',
        'neutral-dark': '#1F2937',
        'neutral-light': '#F9FAFB',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
