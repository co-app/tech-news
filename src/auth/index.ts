import Joi from '@hapi/joi'
import { Exception } from '@src/common/interface/exception'
import { lambdaRouter } from '@src/common/interface/middleware'
import { loggerMiddleware, requestMiddleware } from '@src/common/middlewares/index'
import { statusToRespone } from '@src/common/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { failed, isPass, Try } from 'huelgo-monad'
import { AuthParams } from './auth.dto'

const authParamDto = Joi.object<AuthParams>({
  tag: Joi.string().valid('login', 'join', 'confirm').required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  verification_code: Joi.when('tag', {
    is: 'confirm',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
})

export const handler = lambdaRouter(
  [
    loggerMiddleware(),
    requestMiddleware(authParamDto, (e) =>
      failed({
        message: e,
      })
    ),
  ],
  async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const [{ authHandler: authHandler }, { makeResponse, Logger }] = await Promise.all([
      import('./auth.handler'),
      import('@src/common/utils'),
    ])

    return makeResponse(
      await authHandler(e.body as unknown as AuthParams),
      (t: Try<Exception, boolean>) => isPass(t),
      {
        successFn: (v) => statusToRespone(200, v.value),
        failedFn: (e) => statusToRespone(500, e),
      },
      {
        successLogger: (v) => Logger.info(v),
        errorLogger: (e) => Logger.error(e),
      }
    )
  }
)
