const path = require('path')
const { defineConfig } = require('vite')
import scss from 'rollup-plugin-scss';


module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'dsap',
      fileName: (format) => `dsap.${format}.js`,
    },
    // compile scss to css
    rollupOptions: {
        plugins: [
            scss({
                includePaths: ['./styles'],
                output: './dist/dsap.css',
                failOnError: true,
                outputStyle: 'compressed',
                watch: 'styles',
                runtime: require('sass')
            })
        ]
    }
  }
});