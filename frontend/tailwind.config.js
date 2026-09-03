module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // ---- Brand: light, airy, premium (silver + baby-blue) ----
        brand: {
          snow: '#ffffff',
          mist: '#f7f9fc',
          cloud: '#eef2f7',
          fog: '#e4e9f0',
          line: '#e3e8ef',
          ink: '#0f172a', // primary text (deep navy-slate)
          mut: '#5b6472', // muted text (silver)
          faint: '#98a2b3', // faint text
          blue: '#5bb5e8', // baby-blue accent (brand)
          bluelt: '#7ec8ef',
          bluedd: '#2b86c9',
          bluesoft: 'rgba(91, 181, 232, 0.12)'
        },
        // ---- Legacy tokens mapped to the light system so the whole app
        //      shifts to light/blue without touching every component ----
        gaming: {
          dark: '#ffffff', // old dark surfaces became white
          silver: '#e4e9f0',
          diamond: '#ffffff'
        },
        cyan: {
          300: '#aaddf5',
          400: '#7ec8ef',
          500: '#5bb5e8',
          600: '#3aa0e0',
          700: '#2b86c9'
        },
        purple: {
          300: '#c9ddf5',
          400: '#a9c9ee',
          500: '#7ea8e0',
          600: '#5b8bd0',
          700: '#4673b5',
          800: '#35577f',
          900: '#243c57'
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