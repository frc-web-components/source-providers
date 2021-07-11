const path = require('path');

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'webbit'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@webbitjs/store'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@webbitjs/store': 'webbitStore'
        }
      }
    }
  }
}