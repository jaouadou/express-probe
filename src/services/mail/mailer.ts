/**
 * Mailer class.
 * -------------
 *
 * This class provides all functionalities
 * to send any type of emails.
 */

import mailgun from 'mailgun-js'
import config from '../../config'
import { GenericObject } from '../../interfaces'
import { Logger } from '../../lib'
import { Templates } from './constants'

const getMailgunConf = () => {
  const mailConfig: mailgun.ConstructorParams = {
    apiKey: config.mailing.API_KEY,
    domain: config.mailing.DOMAIN,
  }
  if (config.app.IS_TEST) mailConfig.testMode = true
  return mailConfig
}

export class Mailer {
  private static driver: mailgun.Mailgun = mailgun(getMailgunConf())
  private static config = config.mailing
  private static logger: Logger = new Logger('mailing')

  public static async send(data: {
    email: string | string[],
    subject: string,
    content: string,
  }): Promise<mailgun.messages.SendResponse> {
    return new Promise((resolve, reject) => {
      const _data = {
        from: `${this.config.FROM_EMAIL_NAME} <${this.config.FROM_EMAIL}>`,
        to: data.email,
        subject: data.subject,
        text: data.content,
      }
      this.driver.messages().send(_data, (err, body) => {
        if (err) return reject(err)
        this.logger.info(`Email sent to: ${data.email}`)
        return resolve(body)
      })
    })
  }

  public static sendFromTemplate(email: string | string[], data: {
    template: Templates,
    subject: string,
    vars: GenericObject,
  }): Promise<mailgun.messages.SendResponse> {
    return new Promise((resolve, reject) => {
      const _data = {
        to: email,
        from: `${this.config.FROM_EMAIL_NAME} <${this.config.FROM_EMAIL}>`,
        template: data.template,
        'h:X-Mailgun-Variables': JSON.stringify(data.vars),
      }
      this.driver.messages().send(_data, (err, body) => {
        if (err) return reject(err)
        this.logger.info(`Email sent to: ${email}`)
        return resolve(body)
      })
    })
  }
}
