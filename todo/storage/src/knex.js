const knexfile = require('../knexfile')
const knex = require('knex')(knexfile)

const { Model } = require('objection')
Model.knex(knex)

module.exports = knex
