const common = {
  client: 'postgresql'
}

module.exports = {
  development: {
    ...common,
    connection: 'postgres://postgres:postgres@postgres/development'
  },
  test: {
    ...common,
    connection: 'postgres://postgres:postgres@postgres/test'
  },
  production: {
    ...common,
    connection: process.env.DATABASE_URL
  }
}
