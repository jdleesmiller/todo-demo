import React from 'react'

import NewTask from './new-task'
import Search from './search'
import Task from './task'

import taskStore from '../task-store'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: null,
      listError: null
    }
  }

  componentDidMount() {
    taskStore.listen(() => this.setState({ tasks: taskStore.tasks }))
    this._listTasks()
  }

  componentWillUnmount() {
    taskStore.unlisten()
  }

  async _listTasks() {
    try {
      await taskStore.list()
    } catch (listError) {
      this.setState({ listError })
    }
  }

  render() {
    let listItems
    if (this.state.listError) {
      listItems = (
        <li className="list-group-item">
          Failed to load tasks. Please refresh the page.
        </li>
      )
    } else {
      if (this.state.tasks) {
        listItems = this.state.tasks.map(({ id, description }) => (
          <Task id={id} description={description} key={id} />
        ))
      } else {
        listItems = <li className="list-group-item">Loading&hellip;</li>
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="mt-5 mb-3 text-center">TO DO</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Search />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ul className="list-group">
              <NewTask />
              {listItems}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
