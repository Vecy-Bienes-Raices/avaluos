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
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
