// Install fetch onto `self`, which is also `global`, so we can mock it.
global.self = global
require('whatwg-fetch')

global.fetchMock = require('fetch-mock/es5/client')
global.fetchMock.config.overwriteRoutes = false // append mocked routes

require('jsdom-global')('', {
  // We rely on window.location.origin, which is null with the default
  // about:blank url.
  url: 'http://example.com'
})
