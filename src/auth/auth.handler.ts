import { Exception } from '@src/common/interface/exception'
import { AuthService } from '@src/common/services'
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js'
import { failed, passed, Try } from 'huelgo-monad'
import { AuthParams } from './auth.dto'

export const authHandler = async (params: AuthParams): Promise<Try<Exception, boolean>> => {
  const [{ AuthService }] = await Promise.all([import('@src/common/services')])

  // func lookup table
  const authMapping = {
    login: handleSignup,
    join: handleJoin,
    confirm: handleConfirm,
  }

  // authService
  const authService = new AuthService<AuthParams, Try<Exception, boolean>>()

  // userPool
  const userPool = new CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID || 'ap-northeast-2_9AkhEFUB9',
    ClientId: process.env.COGNITO_CLIENT_ID || '1qhfqebi8va92r46qai6j5ii5b',
  })

  return await authMapping[params.tag](params, authService, userPool)

  return passed(true)
}

export const handleSignup = async (
  params: AuthParams,
  authService: AuthService<AuthParams, Try<Exception, boolean>>,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> =>
  await authService.signup(
    params,
    ({ username, email, password }) =>
      new Promise((res, rej) => {
        userPool.signUp(
          username,
          password,
          [new CognitoUserAttribute({ Name: 'email', Value: email })],
          null,
          (err, _) => {
            if (err) rej(err.message)
            else res(true)
          }
        )
      }).catch((e) => {
        throw e
      }),
    () => passed(true),
    (e) =>
      failed({
        msg: e,
        type: 'Invalid Params',
      } as Exception)
  )
export const handleJoin = async (
  params: AuthParams,
  authService: AuthService<AuthParams, Try<Exception, boolean>>,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> => {
  return passed(true)
}
export const handleConfirm = async (
  params: AuthParams,
  authService: AuthService<AuthParams, Try<Exception, boolean>>,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> => {
  return passed(true)
}
