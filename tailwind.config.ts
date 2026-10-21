import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#030712',
        navy: {
          950: '#040914',
          900: '#071224',
          850: '#0A1830',
          800: '#0F2344',
          700: '#173464',
        },
        accent: {
          DEFAULT: '#FF5722',
          light: '#FF7043',
          dark: '#E64A19',
          glow: 'rgba(255, 87, 34, 0.25)',
        },
        cyan: {
          DEFAULT: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.2)',
        }
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(circle at 50% 30%, rgba(255,87,34,0.08), transparent 70%)',
      },
      backgroundSize: {
        'grid-sm': '32px 32px',
        'grid-lg': '64px 64px',
      }
    },
  },
  plugins: [],
}
export default config
