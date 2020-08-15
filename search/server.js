const http = require('http')

const app = require('./src/app')

const port = parseInt(process.env.PORT, 10)
if (!port) throw new Error('no port given')

const server = http.createServer(app)
server.listen(port, () => console.log(`Listening on port ${port}`))

process.on('SIGTERM', () => server.close())
