import { APIGatewayProxyEvent, Middleware, ObjectSchema } from '@src/common/interface/middleware'

export const requestMiddleware: <E>(
  schema: ObjectSchema,
  exception: (e: unknown) => E
) => Middleware<APIGatewayProxyEvent> = (schema, exception) => {
  return (e, next) => {
    const { error, value } = schema.validate(JSON.parse(e?.body))

    if (error) {
      throw exception(error.details?.map((it) => it.message).join())
    }

    return next({
      ...e,
      body: value,
    })
  }
}
