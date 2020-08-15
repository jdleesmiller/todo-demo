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

  it('filters tasks', async function() {
    await Task.query().insert(
      ['foo', 'foo bar', 'baz'].map(description => ({ description }))
    )

    const { getByText, findByText, getByLabelText } = render(<App />)

    const description = getByLabelText('description to search for')
    const search = getByText('Search')

    await findByText('foo')
    await findByText('foo bar')
    await findByText('baz')

    // Apply search query for foo, which hides baz.
    fireEvent.change(description, { target: { value: 'foo' } })
    fireEvent.click(search)

    await waitForElementToBeRemoved(() => getByText('baz'))
    await findByText('foo')
    await findByText('foo bar')

    // The search query is remembered when completing actions.
    fireEvent.click(getByLabelText('mark foo bar complete'))
    await waitForElementToBeRemoved(() => getByText('foo bar'))

    await findByText('foo')

    // Clear search query.
    fireEvent.change(description, { target: { value: '' } })
    fireEvent.click(search)

    await findByText('foo')
    await findByText('baz')
  })
})
