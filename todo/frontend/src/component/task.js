import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import taskStore from '../task-store'

const Task = ({ id, description }) => {
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    let unmounted = false

    async function complete() {
      try {
        await taskStore.complete(id)
      } catch (err) {
        alert(err.message)
      } finally {
        if (!unmounted) setCompleting(false)
      }
    }
    if (completing) complete()

    return () => {
      unmounted = true
    }
  }, [completing])

  return (
    <li className="list-group-item todo-task">
      <form
        onSubmit={e => {
          setCompleting(true)
          e.preventDefault()
        }}
      >
        <p>
          <span>{description}</span>
          <button
            className="btn btn-success float-right"
            type="submit"
            style={{ minWidth: '3em' }}
            disabled={completing}
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
