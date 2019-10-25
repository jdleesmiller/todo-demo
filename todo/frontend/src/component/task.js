import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import taskStore from '../task-store'

const Task = ({ id, description }) => {
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let unmounted = false

    async function update() {
      try {
        await taskStore.complete(id)
      } catch (err) {
        alert(err.message)
      } finally {
        if (!unmounted) setSubmitting(false)
      }
    }
    if (submitting) update()

    return () => {
      unmounted = true
    }
  }, [submitting])

  return (
    <li className="list-group-item todo-task">
      <form
        onSubmit={e => {
          setSubmitting(true)
          e.preventDefault()
        }}
      >
        <p>
          <span>{description}</span>
          <button
            className="btn btn-success float-right"
            type="submit"
            style={{ minWidth: '3em' }}
            disabled={submitting}
            aria-label={`mark ${description} complete`}
          >
            ✓
          </button>
        </p>
      </form>
    </li>
  )
}

Task.propTypes = {
  id: PropTypes.number,
  description: PropTypes.string
}

export default Task
