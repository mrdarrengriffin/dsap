const path = require('path')
const { defineConfig } = require('vite')
import { terser } from "rollup-plugin-terser";

// map /docs to /docs dir
module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'dsap',
      formats: ['es'],
      fileName: (format) => `dsap.${format}.js`,
    },
    rollupOptions: {
      plugins: [terser()]
    }
  }
});