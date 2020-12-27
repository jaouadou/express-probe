/**
 * Core Logger class.
 * ------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 */

import * as path from 'path'
import * as winston from 'winston'

const { format, transports } = winston

winston.configure({
  format: format.combine(
    format.timestamp(),
    format.simple(),
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm' }),
        format.colorize(),
        format.simple(),
      ),
    }),
  ],
})

export type LogLevel = 'info' | 'debug' | 'warn' | 'error'

export class Logger {
  public static DEFAULT_SCOPE = 'app'

  public static info(message: string, ...args: any[]): void {
    winston.info(`[App] ${message}`, args)
  }

  public static error(message: string, ...args: any[]): void {
    winston.error(`[Error] ${message}`, args)
  }

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath
        .replace(process.cwd(), '')
        .replace(`${path.sep}src${path.sep}`, '')
        .replace(`${path.sep}dist${path.sep}`, '')
        .replace('.ts', '')
        .replace('.js', '')
        .replace(path.sep, ':')
    }
    return filepath
  }

  private scope: string

  constructor(scope?: string) {
    this.scope = Logger.parsePathToScope(scope || Logger.DEFAULT_SCOPE)
  }

  private log(level: LogLevel, message: string|number, args: any[]): void {
    if (winston) {
      winston[level](`[${this.scope}] ${message}`, args)
    }
  }

  public info(message: string, ...args: any[]): void {
    this.log('info', message, args)
  }

  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, args)
  }

  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, args)
  }

  public error(message: string, ...args: any[]): void {
    this.log('error', message, args)
  }
}
