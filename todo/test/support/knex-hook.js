const knex = require('../../src/knex')

// Tear down the connection pool after all the tests have run, so the process
// can exit.
after(function() {
  return knex.destroy()
})
