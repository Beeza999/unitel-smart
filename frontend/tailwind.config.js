export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif']
      },
      colors: {
        unitel: {
          red: '#E5001B',
          dark: '#B8001A',
          orange: '#FF6B2B',
          amber: '#FFAA00'
        }
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        red: '0 8px 32px rgba(229,0,27,0.18)'
      }
    }
  },
  plugins: []
}
