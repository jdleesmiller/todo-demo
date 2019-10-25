import React from 'react'
import td from 'testdouble'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import Task from '../../src/component/task'
import taskStore from '../../src/task-store'

describe('Task', function() {
  afterEach(cleanup)
  afterEach(td.reset)

  const testId = 123
  const testDescription = 'find keys'

  let complete, completeResolve, completeReject
  beforeEach(function() {
    const { getByText } = render(
      <Task id={testId} description={testDescription} />
    )
    complete = getByText('✓')

    const taskStoreComplete = td.replace(taskStore, 'complete')
    const completePromise = new Promise((resolve, reject) => {
      completeResolve = resolve
      completeReject = reject
    })
    td.when(taskStoreComplete(testId)).thenReturn(completePromise)

    fireEvent.click(complete)
  })

  it('completes a task', async function() {
    // The button should be disabled while we're submitting.
    await wait(() => complete.disabled)
    completeResolve()
    await wait(() => !complete.disabled)
  })

  it('handles failure to complete', async function() {
    const alert = td.replace(global, 'alert') // yes, I'm using alert

    // The button should be disabled while we're submitting.
    await wait(() => complete.disabled)
    completeReject(new Error('test message'))
    await wait(() => !complete.disabled)

    // Show the user the error message (ideally would be friendlier).
    td.verify(alert('test message'))
  })
})
