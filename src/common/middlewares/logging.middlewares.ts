import { APIGatewayProxyEvent, Middleware } from '../interface/middleware'

export const loggerMiddleware: () => Middleware<APIGatewayProxyEvent> = () => {
  return (e: APIGatewayProxyEvent, next) => {
    console.log('loggerMiddleware')
    return next(e)
  }
}