import assert from 'assert'
import React from 'react'
import td from 'testdouble'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import NewTask from '../../src/component/new-task'
import taskStore from '../../src/task-store'

describe('NewTask', function() {
  afterEach(cleanup)
  afterEach(td.reset)

  const testDescription = 'find keys'

  let description, addTask, createResolve, createReject
  beforeEach(function() {
    const { getByLabelText } = render(<NewTask />)
    description = getByLabelText('new task description')
    addTask = getByLabelText('add task')

    const taskStoreCreate = td.replace(taskStore, 'create')
    const createPromise = new Promise((resolve, reject) => {
      createResolve = resolve
      createReject = reject
    })
    td.when(taskStoreCreate(testDescription)).thenReturn(createPromise)

    fireEvent.change(description, { target: { value: testDescription } })
    fireEvent.click(addTask)
  })

  it('creates a new task', async function() {
    // The button should be disabled while we're submitting.
    await wait(() => addTask.disabled)
    createResolve()
    await wait(() => !addTask.disabled)

    // Upon success, clear the input and refocus it.
    assert(description.value === '')
    assert(document.activeElement === description)
  })

  it('handles failure to create', async function() {
    const alert = td.replace(global, 'alert') // yes, I'm using alert

    // The button should be disabled while we're submitting.
    await wait(() => addTask.disabled)
    createReject(new Error('test message'))
    await wait(() => !addTask.disabled)

    // Show the user the error message (ideally would be friendlier).
    td.verify(alert('test message'))

    // Upon error, keep the description and refocus the input.
    assert(description.value === testDescription)
    assert(document.activeElement === description)
  })
})
