/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          500: '#14b8a6',
          600: '#0d9488',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        arcade: {
          dark: '#0f0f1b',
          panel: '#181829',
          border: '#313244',
          yellow: '#f9e2af',
          green: '#a6e3a1',
          cyan: '#89dceb',
          blue: '#89b4fa',
          purple: '#cba6f7',
          pink: '#f5c2e7',
          red: '#f38ba8',
          orange: '#fab387',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace', 'Courier New'],
        mono: ['"VT323"', 'monospace', 'Courier New'],
      },
      boxShadow: {
        pixel: '3px 3px 0px 0px rgba(0,0,0,0.9)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.9)',
        'pixel-lg': '5px 5px 0px 0px rgba(0,0,0,0.9)',
        'pixel-yellow': '3px 3px 0px 0px #f9e2af',
        'pixel-green': '3px 3px 0px 0px #a6e3a1',
        'pixel-cyan': '3px 3px 0px 0px #89dceb',
        'pixel-purple': '3px 3px 0px 0px #cba6f7',
      },
      borderWidth: {
        3: '3px',
      }
    },
  },
  plugins: [],
}
