// We need babel for `import`, and it transforms async/await with regenerator.
require('@babel/register')
require('regenerator-runtime/runtime')

// jsdom does not (yet!) have fetch.
global.fetch = require('node-fetch')

require('jsdom-global')('', {
  // This sets window.location.origin, which determines where API requests go.
  url: process.env.BASE_URL
})
