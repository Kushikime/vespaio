import {injectable} from 'inversify';
import winston, {format} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export type LogMessage = string;

export type LogContext = object;

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  TRACE = 'trace',
}

@injectable()
export class Logger {
  private _logger: winston.Logger;
  private _appName: string;

  constructor(appName: string) {
    this._appName = appName;
    this._logger = this._initializeWinston();
  }

  public logInfo(msg: LogMessage, context?: LogContext) {
    this._log(msg, LogLevel.INFO, context);
  }
  public logWarn(msg: LogMessage, context?: LogContext) {
    this._log(msg, LogLevel.WARN, context);
  }
  public logError(msg: LogMessage, context?: LogContext) {
    this._log(msg, LogLevel.ERROR, context);
  }
  public logDebug(msg: LogMessage, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      this._log(msg, LogLevel.DEBUG, context); // Don't log debug in production
    }
  }

  private _log(msg: LogMessage, level: LogLevel, context?: LogContext) {
    this._logger.log(level, msg, {context: context});
  }

  private _initializeWinston() {
    const logger = winston.createLogger({
      transports: this._getTransports(),
      levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        trace: 4,
        debug: 5,
      },
      //   format: winston.format.json(),
    });

    return logger;
  }

  private _getTransports() {
    const transports: any[] = [
      new winston.transports.Console({format: this._getConsoleFormat()}),
    ];

    // if (process.env.NODE_ENV === 'production') {
    transports.push(this._getFileTransport());
    // }

    return transports;
  }

  private _getFileTransport() {
    return new DailyRotateFile({
      filename: `${this._appName}-%DATE%.log`,
      zippedArchive: false, // Compress gzip
      maxSize: '10m', // Rotate after 10MB
      maxFiles: '14d', // Only keep last 14 days
      format: format.combine(format.timestamp(), format.json()),
    });
  }

  private _getConsoleFormat() {
    return format.combine(
      format.colorize(),
      format.timestamp(),
      //   format.printf(info => {
      //     if (!info.message) {
      //       return 'Bad error';
      //     }
      //     const {timestamp, level, message = '', ...meta} = info;

      //     if (message) {
      //       if (typeof message === 'object') {
      //         if ('req' in message) {
      //           const req = (message as any).req; //[ "id", "params", "raw", "query", "log", "body" ]
      //           const method = req.raw.method;
      //           const path = req.raw.url;
      //           const headers = req.raw.headers;
      //           //   console.log(Object.keys(req));
      //           // console.log(`req.id: `, req.id);
      //           // console.log(`req.params: `, req.params);
      //           // console.log(`req.query: `, req.query);
      //           //   console.log('req.raw: ', Object.keys(req.raw));
      //           return `[${timestamp}] [${level}] [${method}] ${path}: ${JSON.stringify(headers ?? {})}`;
      //         }
      //         if ('res' in message) {
      //           const res = (message as any).res; //[ "id", "params", "raw", "query", "log", "body" ]
      //           console.log(Object.keys(res));
      //           console.log(res.log);
      //           console.log(res.raw.statusMessage);
      //           console.log(res.raw.statusCode);
      //           return `RESPONSE`;
      //         }
      //       }
      //       return '';
      //     }
      //     // console.log('info: ', info.message);

      //     // return `[${timestamp}] [${level}]: ${message}`;
      //   }),
    );
  }

  public getLogger() {
    return this._logger;
  }
}

const errorConsoleLogFormat = winston.format.printf(info => {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();

  const time = `${h}:${m}:${s}`;
  return `${time}: [${info.level}]: ${JSON.stringify(info.message, null, 4)}\n`;
});

const logger = winston.createLogger({
  // Define levels required by Fastify (by default winston has verbose level and does not have trace)
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
  // Setup log level
  level: 'info',
  // Setup logs format
  format: winston.format.json(),
  // Define transports to write logs, it could be http, file or console
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
      dirname: 'temp',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: 'errors.log',
      dirname: 'temp',
      level: 'error',
    }),
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(
        winston.format.colorize(),
        errorConsoleLogFormat,
      ),
    }),
  ],
});

export {logger};
