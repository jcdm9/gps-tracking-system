require('winston-daily-rotate-file')
const moment = require('moment')
const { existsSync, mkdirSync } = require('fs')
const { createLogger, format, transports } = require('winston')
const { timestamp, combine, json, printf } = format

// logs path
const path = `${__dirname}/../../files/logs`

// create path if it does not exist
if (!existsSync(path)) {
  mkdirSync(path)
}

const infos = new transports.DailyRotateFile({
  filename: `${path}/combined.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '500m',
  maxFiles: '20d'
})

const errors = new transports.DailyRotateFile({
  level: 'error',
  filename: `${path}/error.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '500m',
  maxFiles: '20d'
})

// initiate and export logger
module.exports = createLogger({
  format: combine(
    json(),
    timestamp(),
    printf(info => {
      console.log(`[${moment(info.timestamp).format('YYYY-MM-DD hh:mm A')}] ${info.level.toUpperCase()} : ${info.message}`)

      return `[${moment(info.timestamp).format('YYYY-MM-DD hh:mm A')}] ${info.level.toUpperCase()} : ${info.message}`
    }),
    printf(error => `[${moment(error.timestamp).format('YYYY-MM-DD hh:mm A')}] ${error.level.toUpperCase()} : ${error.message}`)
  ),
  transports: [infos, errors]
})
