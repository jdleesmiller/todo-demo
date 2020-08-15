const bodyParser = require('body-parser')
const express = require('express')

const { Task } = require('storage')

const app = express()

app.use(bodyParser.json())

// Is the service up?
app.get('/status', (req, res) => res.sendStatus(204))

// Search for tasks.
app.get('/api/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.query()
      .whereRaw(
        'to_tsvector(tasks.description) @@ plainto_tsquery(?)',
        req.query.q || ''
      )
      .orderBy('id')
    res.json({ tasks })
  } catch (error) {
    next(error)
  }
})

module.exports = app
