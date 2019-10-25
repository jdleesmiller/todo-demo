import assert from 'assert'
import td from 'testdouble'

import fetchMock from '../support/fetch-mock'
import taskStore from '../../src/task-store'

describe('TaskStore', function() {
  afterEach(fetchMock.reset)

  afterEach(function() {
    taskStore.unlisten()
  })

  it('lists tasks', async function() {
    const listener = td.function()
    taskStore.listen(listener)

    fetchMock.getOnce('path:/api/tasks', {
      tasks: [{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }]
    })
    await taskStore.list()
    assert(taskStore.tasks.length === 2)

    td.verify(listener())
  })

  it('handles 500 error on listing', async function() {
    taskStore.listen(shouldNotCallListener)
    fetchMock.getOnce('path:/api/tasks', 500)
    try {
      await taskStore.list()
    } catch (err) {
      assert.strictEqual(err.message, 'Failed to list tasks')
    }
  })

  it('handles 400 error on task creation', async function() {
    taskStore.listen(shouldNotCallListener)
    fetchMock.postOnce('path:/api/tasks', {
      status: 400,
      body: { error: { message: 'test: create failed' } }
    })
    try {
      await taskStore.create('')
    } catch (err) {
      assert.strictEqual(err.message, 'test: create failed')
    }
  })

  it('handles 500 error on task creation', async function() {
    taskStore.listen(shouldNotCallListener)
    fetchMock.postOnce('path:/api/tasks', 500)
    try {
      await taskStore.create('find keys')
    } catch (err) {
      assert.strictEqual(err.message, 'Failed to create task')
    }
  })

  it('handles 500 error on task completion', async function() {
    taskStore.listen(shouldNotCallListener)
    fetchMock.deleteOnce('path:/api/tasks/1', 500)
    try {
      await taskStore.complete(1)
    } catch (err) {
      assert.strictEqual(err.message, 'Failed to complete 1')
    }
  })

  function shouldNotCallListener() {
    throw new Error('should not call listener')
  }
})
