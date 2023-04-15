import { Exception } from '@src/common/interface/exception'
import { commonMiddleware } from '@src/common/middlewares'
import { statusToRespone } from '@src/common/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { failed, isFail, isPass, passed, Try } from 'huelgo-monad'
import { AuthParams, authParamSchema } from './auth.dto'

export const handler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Module
  const [{ authHandler: authHandler }, { makeResponse, Logger }] = await Promise.all([
    import('./auth.handler'),
    import('@src/common/utils'),
  ])

  // Middleware
  const middlewareResult = commonMiddleware(
    'validMiddleware',
    e,
    (e) => authParamSchema(e.body as unknown as AuthParams).validate(false),
    ({ error }) => error?.length === 0,
    ({ data }) => passed(data),
    ({ error }) => failed({ type: 'invalid Params', msg: error.join() })
  )

  if (isFail(middlewareResult)) {
    return {
      statusCode: 200,
      body: JSON.stringify(middlewareResult.error),
    }
  }

  // handler
  return makeResponse(
    await authHandler(middlewareResult.value as AuthParams),
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
