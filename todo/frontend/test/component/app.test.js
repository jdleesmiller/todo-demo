import React from 'react'
import td from 'testdouble'
import { cleanup, render, waitForElement } from '@testing-library/react'

import App from '../../src/component/app'
import taskStore from '../../src/task-store'

describe('App', function() {
  afterEach(cleanup)
  afterEach(td.reset)

  it('handles a failure to list tasks', async function() {
    const taskStoreList = td.replace(taskStore, 'list')
    let listReject
    td.when(taskStoreList()).thenReturn(
      new Promise((resolve, reject) => {
        listReject = reject
      })
    )

    const { getByText } = render(<App />)

    await waitForElement(() => getByText(/loading/i))

    listReject(new Error('test: failed to list'))

    await waitForElement(() => getByText(/please refresh the page/i))
  })
})
