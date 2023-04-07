import Joi from '@hapi/joi'
import { lambdaRouter } from '@src/common/interface/middleware'
import { loggerMiddleware, requestMiddleware } from '@src/common/middlewares/index'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { exec } from 'child_process'
import * as _ from 'lodash'
import { promisify } from 'util'
import { AuthParams } from './auth.dto'

const asyncExec = promisify(exec)

const authParamDto = Joi.object<AuthParams>({
  tag: Joi.string().valid('login', 'join').required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
})

export const handler = lambdaRouter(
  [loggerMiddleware(), requestMiddleware(authParamDto)],
  async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    await asyncExec('npm install')

    const m = _.map([1, 2, 3], (n) => n * 2)
    console.log(m)

    console.log(e)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'hello world' }),
    }
  }
)
