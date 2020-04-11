import assert from 'assert'
import React from 'react'
import {
  cleanup as cleanupReactTest,
  fireEvent,
  render,
  waitForElement,
  waitForElementToBeRemoved
} from '@testing-library/react'

import { Task } from 'storage'
import { database as cleanupDatabase } from 'storage/test/support/cleanup'

import App from '../../src/component/app'

describe('TO DO App', function() {
  beforeEach(cleanupDatabase)
  afterEach(cleanupReactTest)

  it('lists, creates and completes tasks', async function() {
    const { getByText, getByLabelText } = render(<App />)

    const description = getByLabelText('new task description')
    const addTask = getByLabelText('add task')

    await waitForElementToBeRemoved(() => getByText(/loading/i))

    fireEvent.change(description, { target: { value: 'find keys' } })
    fireEvent.click(addTask)

    await waitForElement(() => getByText('find keys'))

    fireEvent.change(description, { target: { value: 'buy milk' } })
    fireEvent.click(addTask)

    await waitForElement(() => getByText('buy milk'))

    fireEvent.click(getByLabelText('mark buy milk complete'))

    await waitForElementToBeRemoved(() => getByText('buy milk'))

    fireEvent.click(getByLabelText('mark find keys complete'))

    await waitForElementToBeRemoved(() => getByText('find keys'))

    assert.strictEqual(await Task.query().resultSize(), 0)
  })
})
