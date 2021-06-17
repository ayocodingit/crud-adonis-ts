import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import Sentry from '@ioc:Adonis/Addons/Sentry'
import moment from 'moment'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    this.setLoggerMessage(error, ctx)

    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response
        .status(ctx.response.getStatus())
        .json(this.formatMessageValidation(error.messages.errors))
    }

    if (ctx.response.getStatus() >= 500 && Env.get('NODE_ENV') === 'production') {
      return ctx.response.status(500).json({ message: 'server error ...' })
    }
    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }

  private setLoggerMessage(error: any, ctx: HttpContextContract) {
    const childLogger = this.logger.child({
      'method': ctx.request.method(),
      'url': ctx.request.completeUrl(true),
      'status': ctx.response.getStatus(),
      'user-agent': ctx.request.headers()['user-agent'],
      'date': moment().toISOString()
    })

    if (ctx.response.getStatus() >= 500) {
      childLogger.error(error.messages)
    } else {
      childLogger.info(error.messages)
    }
  }

  private formatMessageValidation(
    payload: Array<{
      rule: string
      field: string
      message: string
    }>
  ) {
    const errors: any = {}

    for (const error of payload) {
      errors[error.field] = [error.message]
    }

    return {
      errors: errors,
    }
  }

  public async report(error: any) {
    if (!this.shouldReport(error)) {
      return
    }

    Sentry.captureException(error.message)
  }
}
