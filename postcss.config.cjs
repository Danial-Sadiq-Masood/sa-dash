module.exports = {
  plugins: [
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require("postcss-prefix-selector")({
      prefix: '.dash-root',
    }),
  ]
}