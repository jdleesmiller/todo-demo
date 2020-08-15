const TASKS_API_ROOT = '/api/tasks'

class TaskStore {
  constructor() {
    this.tasks = []
    this.query = ''
    this.listener = () => {}
  }

  listen(listener) {
    this.listener = listener
  }

  unlisten() {
    this.listener = () => {}
  }

  async list() {
    const response = await fetchJson(listUrl(this.query))
    if (!response.ok) throw new Error('Failed to list tasks')
    const body = await response.json()
    this.tasks = body.tasks
    this.listener()
  }

  async search(query) {
    this.query = query
    await this.list()
  }

  async create(description) {
    const response = await fetchJson(rootUrl(), {
      method: 'POST',
      body: JSON.stringify({ description })
    })
    if (!response.ok) {
      if (response.status === 400) {
        const body = await response.json()
        throw new Error(body.error.message)
      }
      throw new Error('Failed to create task')
    }
    await this.list()
  }

  async complete(id) {
    const response = await fetchJson(itemUrl(id), { method: 'DELETE' })
    if (!response.ok) throw new Error(`Failed to complete ${id}`)
    await response.text() // ignore
    await this.list()
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  })
  return response
}

function rootUrl() {
  return new URL(TASKS_API_ROOT, window.location.origin)
}

function listUrl(query) {
  const url = rootUrl()
  if (query) url.searchParams.set('q', query)
  return url
}

function itemUrl(id) {
  if (!id) throw new Error(`bad id: ${id}`)
  return new URL(id.toString(), rootUrl() + '/')
}

const taskStore = new TaskStore()

export default taskStore
