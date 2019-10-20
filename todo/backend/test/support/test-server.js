const fetch = require('node-fetch')
const app = require('../../src/app')

class TestClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async fetch(path, options) {
    const response = await fetch(new URL(path, this.baseUrl), options)
    return response
  }

  async fetchJson(path, options) {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
    const response = await this.fetch(path, options)
    return response
  }

  get(path, options = {}) {
    return this.fetchJson(path, options)
  }

  delete(path, options = {}) {
    return this.fetchJson(path, { method: 'DELETE', ...options })
  }

  post(path, data, options = {}) {
    return this.fetchJson(path, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    })
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
