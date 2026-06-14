/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          // Surface ramp: bg → card → elevated. Used by container, card,
          // popover/dialog respectively so layers separate via tone, not borders.
          bg:        '#0B0E1F',
          card:      '#11152C',
          elevated:  '#171B36',
          950: '#06070d',
          900: '#0a0b14',
          850: '#0c0f1a',
          800: '#111428',
          700: '#1a1e36',
          600: '#252a45',
          500: '#3a3f5e',
          400: '#5b6080',
          300: '#c4c8db', // muted UI text (timestamps, helper)
          200: '#e0e3ee', // primary paragraph copy
          100: '#f3f4f9', // headlines / stat values
        },
        // Soft ivory for de-emphasized accents — replaces gold for non-CTA
        // text so the actual gold elements pop.
        ivory: {
          50:  '#FAF7F0',
          100: '#F2EDDF',
          200: '#E8E0D0',
          300: '#D6CDB8',
          400: '#B8AE94',
        },
        gold: {
          50:  '#fdf9e7',
          100: '#faf0c4',
          200: '#f4e090',
          300: '#edcc54',
          400: '#e2bb3a',
          500: '#d4af37',
          600: '#b8941e',
          700: '#9a7a16',
          800: '#7a5f12',
          900: '#3d300d',
        },
        // Functional / semantic palette — same saturation/luminance band so
        // status pills and chart series read as a related family.
        primary: { 50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B' },
        success: { 50: '#E6F8EE', 300: '#3DDB85', 500: '#10B981', 700: '#067A55' },
        warning: { 50: '#FBF1DC', 300: '#F2C35F', 500: '#D9941A', 700: '#8E5F0E' },
        danger:  { 50: '#FCE9E9', 300: '#F47B7B', 500: '#E5484D', 700: '#9B2D31' },
        info:    { 50: '#E5F1FB', 300: '#5AAEF1', 500: '#1F86D8', 700: '#125989' },
        muted:   { 50: '#EDEFF3', 300: '#A1A8BD', 500: '#6B7390', 700: '#3A4060' },
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
        // Mono — JetBrains Mono. Used for code, reference IDs, technical data.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
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
        widest: '0.12em',
        eyebrow: '0.22em',
      },
      // Modular type scale (1.250 / major-third). Use these for headings,
      // paragraphs, and numerics so vertical rhythm stays consistent across
      // every page.
      fontSize: {
        'display':  ['72px', { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1':       ['56px', { lineHeight: '1.06', letterSpacing: '-0.018em', fontWeight: '700' }],
        'h1-mob':   ['40px', { lineHeight: '1.08', letterSpacing: '-0.018em', fontWeight: '700' }],
        'h2':       ['40px', { lineHeight: '1.10', letterSpacing: '-0.015em', fontWeight: '700' }],
        'h2-mob':   ['32px', { lineHeight: '1.12', letterSpacing: '-0.012em', fontWeight: '700' }],
        'h3':       ['32px', { lineHeight: '1.18', letterSpacing: '-0.01em',  fontWeight: '700' }],
        'h3-mob':   ['24px', { lineHeight: '1.22', letterSpacing: '-0.005em', fontWeight: '700' }],
        'h4':       ['24px', { lineHeight: '1.28', fontWeight: '600' }],
        'h4-mob':   ['18px', { lineHeight: '1.32', fontWeight: '600' }],
        'body':     ['16px', { lineHeight: '1.7' }],
        'small':    ['13px', { lineHeight: '1.55' }],
      },
      // Section vertical rhythm — used by every page so spacing stays
      // unified. py-section-mobile / md:py-section-tablet / lg:py-section.
      spacing: {
        'section':         '120px',
        'section-tablet':  '80px',
        'section-mobile':  '56px',
      },
      maxWidth: {
        'content': '1280px',
        'content-wide': '1440px',
      },
    },
  },
  plugins: [],
}
