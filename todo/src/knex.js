const knexfile = require('../knexfile')
const knex = require('knex')(knexfile[process.env.NODE_ENV || 'development'])

const { Model } = require('objection')
Model.knex(knex)

module.exports = knex
