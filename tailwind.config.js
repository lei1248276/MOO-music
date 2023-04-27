/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        black: {
          1: '#010001',
          2: '#1a191b'
        },
        yellow: {
          1: '#fce939'
        },
        white: {
          1: '#fffeff'
        },
        grey: {
          1: '#959292',
          2: '#666666'
        },
        red: {
          1: '#fd3148'
        }
      }
    }
  },
  plugins: []
}

