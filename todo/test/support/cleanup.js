// Try not to delete the wrong data by accident.
if (process.env.NODE_ENV === 'production') {
  throw new Error('cleanup cannot run in production')
}

const knex = require('../../src/knex')

require('./knex-hook')

exports.database = database

async function database() {
  const tables = ['tasks']
  for (const table of tables) {
    await knex(table).del()
  }
}
