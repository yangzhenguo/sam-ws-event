const log4js = require('log4js')
const rTracer = require('cls-rtracer')

const config = {
  "appenders": {
    "stdout": {
      "type": "stdout"
    },
    "appFile": {
      "type": "file",
      "filename": "logs/app.log",
      "keepFileExt": true,
      "maxLogSize": 10485760,
      "numBackups": 3
    },
    "app": {
      "type": "logLevelFilter",
      "level": "TRACE",
      "maxLevel": "INFO",
      "appender": "appFile"
    },
    "access": {
      "type": "dateFile",
      "pattern": "-yyyy-MM-dd",
      "filename": "logs/access.log",
      "keepFileExt": true,
      "category": "http",
      layout: {
        type: 'pattern',
        pattern: '%d %p %c [request-id: %X{requestId}] %m'
      }
    },
    "errorFile": {
      "type": "file",
      "filename": "logs/errors.log",
      layout: {
        type: 'pattern',
        pattern: '%d %p %c [request-id: %X{requestId}] %m %s',
      }
    },
    "error": {
      "type": "logLevelFilter",
      "level": "ERROR",
      "appender": "errorFile"
    }
  },
  "categories": {
    "default": {
      "appenders": [
        "stdout",
        "app",
        "error"
      ],
      "level": "TRACE",
      "enableCallStack": true
    },
    "http": {
      "appenders": [
        "stdout",
        "access"
      ],
      "level": "TRACE",
      "enableCallStack": true
    }
  }
}

log4js.configure(config)

const httpLogger = log4js.getLogger('http')
const defaultLogger = log4js.getLogger()

const populateRequestId = async (req, res, next) => {
  defaultLogger.addContext('requestId', rTracer.id())
  httpLogger.addContext('requestId', rTracer.id())
  await next()
  defaultLogger.clearContext()
  httpLogger.clearContext()
}

module.exports = {
  httpLogger,
  defaultLogger,
  populateRequestId
}
