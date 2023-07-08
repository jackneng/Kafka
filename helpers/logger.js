/**
 * Logging configurations
 * The logger uses a transporter for the main process
 * Logger only logs info level and up for production environments;
 * for more verbosity change NODE_ENV into any other value
 */
var winston = require('winston');
var { logLevel } = require('kafkajs')
var fs = require('fs');
const _ = require('lodash');
require('winston-daily-rotate-file');

var dirbase = './logs';

fs.stat(dirbase, function (err, stats) {
  if (err && err.errno === 34) {
    fs.mkdir(dirbase);
    logger.info("Log folder Created")
  } else {
    // logger.warn("Log folder exist");
  }
})


var console_transport = new winston.transports.Console({
  level: 'debug',
});

const format = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  // winston.format.colorize(),
  winston.format.metadata(),
  winston.format.splat(),
  winston.format.printf((log) => {
    const stack = new CustomError().stack;
    const CALLER_INDEX = 10; // <- position in stacktrace to find deepest caller
    const element = stack[CALLER_INDEX];
    let meta = _.omit(log.metadata, 'timestamp');
    let moreMeta = {
      fileName: element.getFileName(),
      functionName: element.getFunctionName(),
      lineNumber: element.getLineNumber()
    };

    var message = (log.metadata.stack) ? log.metadata.stack :
      typeof(log.message) == 'string' ? log.message : JSON.stringify(log.message, null, 2);

    return `${log.metadata.timestamp} ${log.level}: ${message}
${(Object.keys(meta).length > 0) ? JSON.stringify(meta, null, 2) + "\n" : ''}${JSON.stringify(moreMeta, null, 2)}`;
  }),
);


winston.loggers.exitOnError = false;

winston.loggers.add('logger', {
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'logger.info',
      level: (process.env.NODE_ENV != 'production') ? 'debug' : 'info',
      dirname: `${dirbase}`,
      filename: 'enrichment-%DATE%.log',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new (winston.transports.DailyRotateFile)({
      name: 'logger.error',
      level: 'error',
      dirname: `${dirbase}`,
      filename: 'enrichment-%DATE%-error.log',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    console_transport
  ],
  format: format,
});

var logger = winston.loggers.get('logger');

function CustomError() {
  // Use V8's feature to get a structured stack trace
  const oldStackTrace = Error.prepareStackTrace;
  const oldLimit = Error.stackTraceLimit;
  try {
    Error.stackTraceLimit = 11; // <- we only need the top 11
    Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
    Error.captureStackTrace(this, CustomError);
    this.stack; // <- invoke the getter for 'stack'
  } finally {
    Error.stackTraceLimit = oldLimit;
    Error.prepareStackTrace = oldStackTrace;
  }
}

const toWinstonLogLevel = level => {
    switch(level) {
        case logLevel.ERROR:
        case logLevel.NOTHING:
            return 'error'
        case logLevel.WARN:
            return 'warn'
        case logLevel.INFO:
            return 'info'
        case logLevel.DEBUG:
            return 'debug'
    }
}

const WinstonLogCreator = logLevel => {
    const logger = winston.createLogger({
        level: toWinstonLogLevel(logLevel),
        transports: [
          new (winston.transports.DailyRotateFile)({
            name: 'logger.info',
            level: (process.env.NODE_ENV != 'production') ? 'debug' : 'info',
            dirname: `${dirbase}`,
            filename: 'enrichment-%DATE%.log',
            zippedArchive: true,
            maxFiles: '30d',
          }),
          new (winston.transports.DailyRotateFile)({
            name: 'logger.error',
            level: 'error',
            dirname: `${dirbase}`,
            filename: 'enrichment-%DATE%-error.log',
            zippedArchive: true,
            maxFiles: '30d',
          }),
          console_transport
        ],
    })

    return ({ namespace, level, label, log }) => {
        const { message, ...extra } = log
        logger.log({
            level: toWinstonLogLevel(level),
            message,
            extra,
        })
    }
}

module.exports = {
  logger,
  winston,
  WinstonLogCreator
}
