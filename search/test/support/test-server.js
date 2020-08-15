const fetch = require('node-fetch')
const app = require('../../src/app')

class TestClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async search(query, options = {}) {
    const url = new URL('/api/tasks', this.baseUrl)
    url.searchParams.set('q', query)

    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
    const response = await fetch(url, options)
    return response
  }
}

before(function(done) {
  // Zero means to start the test server on a random free port.
  this.testServer = app.listen(0, () => {
    this.testClient = new TestClient(
      `http://localhost:${this.testServer.address().port}`
    )
    done()
  })
})

after(function(done) {
  this.testServer.close(done)
})
