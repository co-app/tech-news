import { Logger } from '@src/common/utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  Logger.info()
  console.log(JSON.stringify(e, null, 2))

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' }),
  }
}
