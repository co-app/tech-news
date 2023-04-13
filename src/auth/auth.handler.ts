import { Exception } from '@src/common/interface/exception'
import { passed, Try } from 'huelgo-monad'
import { AuthParams } from './auth.dto'

export const authHandler = async (params: AuthParams): Promise<Try<Exception, boolean>> => {
  const [AWS, { CognitoUserPool }] = await Promise.all([
    import('@src/common/services'),
    import('amazon-cognito-identity-js'),
  ])

  const cognitoService = new AWS.AuthService<AuthParams>()

  // join
  if (params.tag === 'join') {
  }

  // login

  return passed(true)
}
