const assert = require('assert')

const cleanup = require('storage/test/support/cleanup')

const { Task } = require('storage')

describe('Task', function() {
  beforeEach(cleanup.database)

  it('can be created with a valid description', async function() {
    const description = 'a'.repeat(255)
    const task = await Task.query().insert({ description })
    assert.strictEqual(task.description, description)
  })

  it('must have a description', async function() {
    try {
      await Task.query().insert({
        description: ''
      })
      assert.fail()
    } catch (error) {
      assert(error instanceof Task.ValidationError)
      assert(/should NOT be shorter than 1 characters/.test(error.message))
    }
  })

  it('must not have an overly long description', async function() {
    try {
      await Task.query().insert({
        description: 'a'.repeat(1000)
      })
      assert.fail()
    } catch (error) {
      assert(error instanceof Task.ValidationError)
      assert(/should NOT be longer than 255 characters/.test(error.message))
    }
  })
})
