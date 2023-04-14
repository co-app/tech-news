import { Exception } from '@src/common/interface/exception'
import { AuthService } from '@src/common/services'
import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js'
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

  return await authMapping[params.tag](
    params,
    new AuthService(),
    new CognitoUserPool({
      UserPoolId: process.env.COGNITO_USER_POOL_ID || 'ap-northeast-2_9AkhEFUB9',
      ClientId: process.env.COGNITO_CLIENT_ID || '1qhfqebi8va92r46qai6j5ii5b',
    })
  )
}

// 회원가입
export const handleSignup = async (
  params: AuthParams,
  authService: AuthService,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> =>
  await authService.execute<AuthParams, Try<Exception, boolean>>(
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

// 로그인
export const handleJoin = async (
  params: AuthParams,
  authService: AuthService,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> => {
  return passed(true)
}

// 인증번호 확인
export const handleConfirm = async (
  { username, verification_code: verificationCode }: AuthParams,
  authService: AuthService,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  })

  return authService.execute<string, Try<Exception, boolean>>(
    verificationCode,
    (verificationCode) =>
      new Promise((res, rej) => {
        cognitoUser.confirmRegistration(verificationCode, true, (err, _) => {
          if (err) rej(err.message)
          else res(true)
        })
      }),
    () => passed(true),
    (e) => failed({ msg: e, type: 'Invalid Params' } as Exception)
  )
}
