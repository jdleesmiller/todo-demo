const assert = require('assert')

const cleanup = require('storage/test/support/cleanup')

const { Task } = require('storage')

// Ensure the global test server is started, for this.testClient.
require('../support/test-server')

describe('search', function() {
  beforeEach(cleanup.database)

  it('lists only matching tasks', async function() {
    await Task.query().insert(
      ['foo', 'bar', 'foo bar'].map(description => ({ description }))
    )

    const response = await this.testClient.search('foo')
    assert(response.ok)
    const body = await response.json()
    assert.strictEqual(body.tasks.length, 2)
    assert.strictEqual(body.tasks[0].description, 'foo')
    assert.strictEqual(body.tasks[1].description, 'foo bar')
  })

  it('can return no tasks', async function() {
    await Task.query().insert(
      ['foo', 'bar'].map(description => ({ description }))
    )
    const response = await this.testClient.search('baz')
    assert(response.ok)
    const body = await response.json()
    assert.strictEqual(body.tasks.length, 0)
  })

  it('does not support boolean logic for now', async function() {
    await Task.query().insert(
      ['foo bar', 'foo baz'].map(description => ({ description }))
    )

    // If this parsed to foo OR bar, we'd match both; to keep this demo simple,
    // we're not parsing complicated queries like this.
    const response = await this.testClient.search('foo | bar')
    assert(response.ok)
    const body = await response.json()
    assert.strictEqual(body.tasks.length, 1)
    assert.strictEqual(body.tasks[0].description, 'foo bar')
  })

  it('ignores English stop words', async function() {
    await Task.query().insert(
      ['foo', 'foo bar'].map(description => ({ description }))
    )

    const response = await this.testClient.search('the foo')
    assert(response.ok)
    const body = await response.json()
    assert.strictEqual(body.tasks.length, 2)
  })
})
