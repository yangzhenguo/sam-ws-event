const path = require('path')
const express = require('express')
const http = require('http')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
