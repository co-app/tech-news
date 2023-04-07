import { Logger } from '@src/common/utils/logger'
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  Logger.info(`Context: ${JSON.stringify(context, null, 2)}`)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'bye world',
    }),
  }
}
