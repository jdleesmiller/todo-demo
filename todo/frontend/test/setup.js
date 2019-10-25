// We need babel for `import`, and it transforms async/await with regenerator.
require('@babel/register')
require('regenerator-runtime/runtime')

require('jsdom-global')('', {
  // We rely on window.location.origin, which is null with the default
  // about:blank url.
  url: 'http://example.com'
})
