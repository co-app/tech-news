import Joi from '@hapi/joi'
import { lambdaRouter } from '@src/common/interface/middleware'
import { loggerMiddleware, requestMiddleware } from '@src/common/middlewares/index'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { failed } from 'huelgo-monad'
import { AuthParams } from './auth.dto'

const authParamDto = Joi.object<AuthParams>({
  tag: Joi.string().valid('login', 'join').required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
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
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'hello world' }),
    }
  }
)
