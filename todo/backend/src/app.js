const bodyParser = require('body-parser')
const express = require('express')

const { Task } = require('storage')

const app = express()

app.use(bodyParser.json())

app.use(express.static('dist'))

// Is the service up?
app.get('/status', (req, res) => res.sendStatus(204))

// List tasks.
app.get('/api/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.query().orderBy('id')
    res.json({ tasks })
  } catch (error) {
    next(error)
  }
})

// Create a new task.
app.post('/api/tasks', async (req, res, next) => {
  try {
    const task = await Task.query().insert({
      description: req.body.description
    })
    res.json({ task })
  } catch (error) {
    if (error instanceof Task.ValidationError) {
      res.status(400).json({ error: { message: error.message } })
      return
    }
    next(error)
  }
})

// Check the id route param looks like a valid id.
app.param('id', (req, res, next, id) => {
  if (/^\d+$/.test(req.params.id)) return next()
  res.sendStatus(404)
})

// Complete a task (by deleting it from the task list).
app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    await Task.query().deleteById(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = app
