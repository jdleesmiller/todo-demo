import React, { useState, useEffect } from 'react'

import taskStore from '../task-store'

const NewTask = () => {
  const descriptionRef = React.createRef()
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [refocusNeeded, setRefocusNeeded] = useState(false)

  useEffect(() => {
    async function create() {
      try {
        await taskStore.create(description)
        setDescription('')
      } catch (err) {
        alert(err.message)
      } finally {
        setSubmitting(false)
        setRefocusNeeded(true)
      }
    }
    if (submitting) create()
  }, [submitting])

  // The field loses focus after the submit, so put it back manually.
  useEffect(() => {
    if (refocusNeeded) {
      descriptionRef.current.focus()
      setRefocusNeeded(false)
    }
  }, [refocusNeeded])

  return (
    <li className="list-group-item todo-new-task">
      <form
        onSubmit={e => {
          setSubmitting(true)
          e.preventDefault()
        }}
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            name="description"
            ref={descriptionRef}
            value={description}
            disabled={submitting}
            onChange={() => setDescription(descriptionRef.current.value)}
            aria-label="new task description"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
              style={{ minWidth: '3em' }}
              aria-label="add task"
            >
              ＋
            </button>
          </div>
        </div>
      </form>
    </li>
  )
}

export default NewTask
