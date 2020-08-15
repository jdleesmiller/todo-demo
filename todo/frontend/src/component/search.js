import React, { useEffect, useState } from 'react'

import taskStore from '../task-store'

const Search = () => {
  const queryRef = React.createRef()

  const [submitting, setSubmitting] = useState(false)
  const [refocusNeeded, setRefocusNeeded] = useState(false)

  useEffect(() => {
    async function search() {
      try {
        setSubmitting(true)
        await taskStore.search(queryRef.current.value)
      } catch (err) {
        alert(err.message)
      } finally {
        setSubmitting(false)
        setRefocusNeeded(true)
      }
    }
    if (submitting) search()
  }, [submitting])

  // The field loses focus after the submit, so put it back manually.
  useEffect(() => {
    if (refocusNeeded) {
      queryRef.current.focus()
      setRefocusNeeded(false)
    }
  }, [refocusNeeded])

  return (
    <form
      onSubmit={e => {
        setSubmitting(true)
        e.preventDefault()
      }}
      className="todo-search"
    >
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          aria-label="description to search for"
          ref={queryRef}
          disabled={submitting}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  )
}

export default Search
