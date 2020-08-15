import React from 'react'
import td from 'testdouble'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import Search from '../../src/component/search'
import taskStore from '../../src/task-store'

describe('App', function() {
  afterEach(cleanup)
  afterEach(td.reset)

  const testQuery = 'test'

  it('handles a failure to search', async function() {
    const alert = td.replace(global, 'alert')

    const taskStoreSearch = td.replace(taskStore, 'search')
    let searchReject
    td.when(taskStoreSearch(testQuery)).thenReturn(
      new Promise((resolve, reject) => {
        searchReject = reject
      })
    )

    const { getByLabelText, getByText } = render(<Search />)
    const description = getByLabelText('description to search for')
    const search = getByText('Search')

    fireEvent.change(description, { target: { value: testQuery } })
    fireEvent.click(search)

    await wait(() => search.disabled)
    searchReject(new Error('test message'))
    await wait(() => !search.disabled)

    // Show the user the error message (ideally would be friendlier).
    td.verify(alert('test message'))
  })
})
