module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens — single source of truth.
        brand: {
          DEFAULT: '#0c0d10',
          surface: '#14161b',
          surface2: '#1a1d24',
          surface3: '#22262f',
          gold: '#d4af37',
          goldstrong: '#e6c75a'
        },
        gaming: {
          dark: '#0c0d10',
          silver: '#c0c0c0',
          diamond: '#e8e8e8'
        },
        // Decorative accent colors that previously clashed with gold are
        // consolidated to the gold ramp so the whole app reads as one
        // cohesive dark + gold system. Role colors (amber/green/blue/
        // orange used in hero data) are intentionally left intact.
        cyan: {
          300: '#e8d27e',
          400: '#ddbd52',
          500: '#d4af37',
          600: '#b8962e',
          700: '#967826'
        },
        purple: {
          300: '#e8d27e',
          400: '#ddbd52',
          500: '#d4af37',
          600: '#b8962e',
          700: '#7a6626',
          800: '#3f3a2e',
          900: '#272219'
        }
      }
    }
  },
  plugins: []
}