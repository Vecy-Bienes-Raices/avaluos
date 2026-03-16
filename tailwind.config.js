/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
            coffee: {
                darkest: '#503E33', // Color 1
                dark: '#5D493A',    // Color 2
                medium: '#665145',  // Color 3
                light: '#937E74',   // Color 4
            },
            gold: '#CCAC4E',      // Color 5
            glass: '#F3F3F4',     // Color 6 (White/Glass)
            orange: '#FE4906',    // Color 7
            emerald: '#0DBB83',   // Color 8
            red: '#E32527',       // Color 9
            
            // Functional Mappings
            primary: '#5D493A',   // Color 2
            secondary: '#937E74', // Color 4
            accent: '#CCAC4E',    // Color 5
            highlight: '#FE4906', // Color 7
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { left: '-100%', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { left: '100%', opacity: '0' },
        },
        fadeIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.outfit'),
            color: 'inherit',
            a: {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            p: { color: 'inherit' },
            span: { color: 'inherit' },
            li: { color: 'inherit' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
