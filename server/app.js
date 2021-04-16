const path = require('path')
const express = require('express')
const http = require('http')
const log4js = require('log4js')
const favicon = require('serve-favicon')
const rTracer = require('cls-rtracer')

const { defaultLogger, httpLogger, populateRequestId } = require('../config/log4js')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const faviconPath = path.join(__dirname, '../public', 'favicon.ico')
const publicPath = path.join(__dirname, '../public')

app.use(favicon(faviconPath))
app.use(express.static(publicPath))
app.use(rTracer.expressMiddleware())

app.use(populateRequestId)

app.use(log4js.connectLogger(httpLogger, { level: 'auto' }));

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.use('*', (error, req, res, next) => {
  defaultLogger.error(error)
  res.send(`error: ${error.message}`)
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
