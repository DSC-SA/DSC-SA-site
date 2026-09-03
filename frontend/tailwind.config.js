module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ---- Brand: premium (silver + baby-blue), mapped to CSS vars so
        //      `[data-theme="dark"]` automatically re-tints every utility. ----
        brand: {
          snow: 'rgb(var(--surface))',      // #ffffff surface
          mist: 'rgb(var(--bg))',           // app bg
          cloud: 'rgb(var(--surface-soft))',// soft surface
          fog: 'rgb(var(--surface-tint))',
          line: 'rgb(var(--border))',
          ink: 'rgb(var(--text))',          // primary text
          mut: 'rgb(var(--text-muted))',    // muted text
          faint: 'rgb(var(--text-faint))',  // faint text
          blue: 'rgb(var(--blue))',         // baby-blue accent
          bluelt: 'rgb(var(--blue-lt))',
          bluedd: 'rgb(var(--blue-strong))',
          bluesoft: 'rgb(var(--blue) / <alpha-value>)'
        },
        // ---- Legacy tokens mapped to the light/dark system so the whole app
        //      shifts without touching every component ----
        gaming: {
          dark: 'rgb(var(--surface))', // old dark surfaces became themed surface
          silver: 'rgb(var(--surface-tint))',
          diamond: 'rgb(var(--surface))'
        },
        cyan: {
          300: 'rgb(var(--blue-lt))',
          400: 'rgb(var(--blue-lt))',
          500: 'rgb(var(--blue))',
          600: 'rgb(var(--blue-strong))',
          700: 'rgb(var(--blue-strong))'
        },
        purple: {
          300: 'rgb(var(--blue-lt))',
          400: 'rgb(var(--blue))',
          500: 'rgb(var(--blue))',
          600: 'rgb(var(--blue-strong))',
          700: 'rgb(var(--blue-strong))',
          800: 'rgb(var(--blue-strong))',
          900: 'rgb(var(--blue-strong))'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.16)',
        lift: '0 18px 45px -15px rgba(15, 23, 42, 0.24)',
        glow: '0 10px 40px -12px rgba(91, 181, 232, 0.45)'
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem'
      }
    }
  },
  plugins: []
}