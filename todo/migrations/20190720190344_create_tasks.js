exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments()
    table.string('description', 255).notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks')
}
