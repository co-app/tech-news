import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * Middleware
 */
export type Middleware<T> = (e: T, next: (e: T) => Promise<any>) => Promise<any>

/**
 * Proxy Event
 */
export type ProxyEvent<T> = APIGatewayProxyEvent & {
  _body: T
}

const lambdaWithMiddleware =
  <T>(middlewares: Middleware<T>[], handler) =>
  (e: T) => {
    const chain = ([first, ...rest]: Middleware<T>[]) => {
      if (first) {
        return (e: T): Promise<any> => {
          try {
            return first(e, chain(rest))
          } catch (e) {
            return Promise.reject(e)
          }
        }
      }

      return handler
    }

    return chain(middlewares)(e)
  }

export const lambdaRouter = <T, K extends APIGatewayProxyEvent, F>(
  middlewares: Middleware<T>[],
  handler: (e: K) => Promise<F>
) => lambdaWithMiddleware(middlewares, handler)
