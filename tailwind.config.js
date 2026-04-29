/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070d',
          900: '#0a0b14',
          850: '#0c0f1a',
          800: '#111428',
          700: '#1a1e36',
          600: '#252a45',
          500: '#3a3f5e',
          400: '#5b6080',
          // Lightened readable copy tokens — every paragraph using
          // text-ink-200 / text-ink-300 now clears the #e0e0e0-on-dark bar.
          300: '#c4c8db', // muted UI text (timestamps, helper)
          200: '#e0e3ee', // primary paragraph copy
          100: '#f3f4f9', // headlines / stat values
        },
        gold: {
          50: '#fdf9e7',
          100: '#faf0c2',
          200: '#f4e08f',
          300: '#eccc56',
          400: '#e3b933',
          500: '#d4af37',
          600: '#b08d24',
          700: '#8a6c1d',
          800: '#634e16',
          900: '#3d300d',
        },
      },
      fontFamily: {
        // Display — Playfair Display 700/800. The luxury editorial serif
        // (Vogue, Architectural Digest, Sotheby's). All h1/h2/h3.
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Body & UI — DM Sans. Clean modern geometric sans, designed pair to
        // DM Serif. Used for all paragraphs, nav, buttons, labels, tables.
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        // Numbers — Outfit 700/800. Bold geometric, commanding. Used for
        // every BD price, stat counter, percentage, sqm value, distance.
        numbers: ['Outfit', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
        'gold-gradient-subtle': 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(244,208,63,0.85))',
        'navy-gradient': 'linear-gradient(180deg, #0a0b14 0%, #111428 100%)',
        'radial-gold': 'radial-gradient(circle at 30% 20%, rgba(212,175,55,0.18), transparent 60%)',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.18), 0 12px 48px -12px rgba(212,175,55,0.35)',
        'gold-soft': '0 8px 32px -12px rgba(212,175,55,0.25)',
        'gold-strong': '0 0 0 1px rgba(212,175,55,0.4), 0 24px 60px -16px rgba(212,175,55,0.55)',
        edge: '0 1px 0 0 rgba(255,255,255,0.04)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.45)' },
          '50%': { boxShadow: '0 0 0 14px rgba(37, 211, 102, 0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
      letterSpacing: {
        // Restrained luxury tracking — was 0.32em which read as awkwardly
        // wide. 0.12em keeps small-caps eyebrows feeling refined without the
        // letters drifting apart.
        widest: '0.12em',
      },
    },
  },
  plugins: [],
}
