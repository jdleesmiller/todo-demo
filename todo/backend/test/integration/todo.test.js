const assert = require('assert')

const cleanup = require('storage/test/support/cleanup')

const { Task } = require('storage')

// Ensure the global test server is started, for this.testClient.
require('../support/test-server')

describe('todo', function() {
  beforeEach(cleanup.database)

  describe('with existing tasks', function() {
    let exampleTasks
    beforeEach(async function() {
      exampleTasks = await Task.query().insert(
        ['foo', 'bar'].map(description => ({ description }))
      )
    })

    it('lists the tasks', async function() {
      const response = await this.testClient.get('/api/tasks')
      assert(response.ok)
      const body = await response.json()
      assert.strictEqual(body.tasks.length, 2)
      assert.strictEqual(body.tasks[0].description, 'foo')
      assert.strictEqual(body.tasks[1].description, 'bar')
    })

    it('searches the tasks', async function() {
      const response = await this.testClient.get('/api/tasks?q=foo')
      assert(response.ok)
      const body = await response.json()
      assert.strictEqual(body.tasks.length, 1)
      assert.strictEqual(body.tasks[0].description, 'foo')
    })

    it('completes a task', async function() {
      const response = await this.testClient.delete(
        `/api/tasks/${exampleTasks[0].id}`
      )
      assert.strictEqual(response.status, 204)

      const remainingTasks = await Task.query()
      assert.strictEqual(remainingTasks.length, 1)
      assert.strictEqual(remainingTasks[0].id, exampleTasks[1].id)
    })
  })

  it('creates a task', async function() {
    const response = await this.testClient.post('/api/tasks', {
      description: 'foo'
    })
    const body = await response.json()
    assert.strictEqual(body.task.description, 'foo')
  })

  it('handles a validation error on create', async function() {
    const response = await this.testClient.post('/api/tasks', {})
    assert(!response.ok)
    assert.strictEqual(response.status, 400)
    const body = await response.json()
    assert.strictEqual(
      body.error.message,
      'description: is a required property'
    )
  })

  it('handles an invalid task ID', async function() {
    const response = await this.testClient.delete(`/api/tasks/foo`)
    assert.strictEqual(response.status, 404)
  })
})
