import { Middleware } from '@src/common/interface/middleware'
import { APIGatewayProxyEvent } from 'aws-lambda'

export const requestMiddleware: (schema: T) => Middleware<APIGatewayProxyEvent> = (schema) => {
  return (e, next) => {
    const { error, value } = schema.validate(e.body)
    if (error) {
      return Promise.reject(error)
    }

    return next(value)
  }
}
