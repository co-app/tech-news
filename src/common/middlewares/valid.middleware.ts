import { APIGatewayProxyEvent, Middleware, ObjectSchema } from '@src/common/interface/middleware'

export const requestMiddleware: (schema: ObjectSchema) => Middleware<APIGatewayProxyEvent> = (schema) => {
  return (e, next) => {
    const { error, value } = schema.validate(e.body)
    if (error) {
      return Promise.reject(error)
    }

    return next(value)
  }
}
