/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        asphalt: {
          50:  '#f5f5f5',
          100: '#d8d8d8',
          200: '#a8a8a8',
          300: '#787878',
          400: '#4a4a4a',
          500: '#2a2a2a',
          600: '#1a1a1a',
          700: '#121212',
          800: '#0a0a0a',
          900: '#050505',
        },
        racing: {
          red:    '#e10600',
          redDk:  '#a10400',
          yellow: '#ffcc00',
          orange: '#ff6b00',
          chrome: '#d9d9d9',
        },
      },
      fontFamily: {
        display: ['"Monoton"', 'sans-serif'],
        racing:  ['"Russo One"', '"Racing Sans One"', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'checker': "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2220%22 height=%2220%22 fill=%22%23fff%22/><rect x=%2220%22 y=%2220%22 width=%2220%22 height=%2220%22 fill=%22%23fff%22/></svg>')",
        'grid':    "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
        'stripes': "repeating-linear-gradient(45deg, #ffcc00 0 16px, #0a0a0a 16px 32px)",
      },
      boxShadow: {
        'racing': '0 0 0 2px #e10600, 0 8px 40px rgba(225,6,0,.25)',
        'chrome': 'inset 0 1px 0 rgba(255,255,255,.15), 0 4px 24px rgba(0,0,0,.6)',
      },
      animation: {
        'rev':      'rev 2.5s ease-in-out infinite',
        'scroll-x': 'scroll-x 30s linear infinite',
        'flag':     'flag 1.2s ease-in-out infinite',
      },
      keyframes: {
        rev: {
          '0%,100%': { transform: 'translateX(0)' },
          '50%':     { transform: 'translateX(4px)' },
        },
        'scroll-x': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flag: {
          '0%,100%': { backgroundPosition: '0 0' },
          '50%':     { backgroundPosition: '40px 0' },
        },
      },
    },
  },
  plugins: [],
};
