import Joi from '@hapi/joi'
import { lambdaRouter } from '@src/common/interface/middleware'
import { loggerMiddleware, requestMiddleware } from '@src/common/middlewares/index'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AuthParams } from './auth.dto'

const authParamDto = Joi.object<AuthParams>({
  tag: Joi.string().valid('login', 'join').required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
})

export const handler = lambdaRouter(
  [loggerMiddleware(), requestMiddleware(authParamDto)],
  async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const [{ Logger }] = await Promise.all([import('@src/common/utils/logger')])

    Logger.info(e.body)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'hello world' }),
    }
  }
)
