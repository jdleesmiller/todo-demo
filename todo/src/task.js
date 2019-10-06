const { Model } = require('objection')

require('./knex') // ensure database connections are set up

class Task extends Model {
  static get tableName() {
    return 'tasks'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['description'],

      properties: {
        id: { type: 'integer' },
        description: { type: 'string', minLength: 1, maxLength: 255 }
      }
    }
  }
}

module.exports = Task
