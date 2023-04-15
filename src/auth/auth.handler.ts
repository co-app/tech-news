import { Exception } from '@src/common/interface/exception'
import { AuthService } from '@src/common/services'
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js'
import { failed, passed, Try } from 'huelgo-monad'
import { AuthParams } from './auth.dto'

export const authHandler = async (params: AuthParams): Promise<Try<Exception, boolean>> => {
  console.log('auth Handler : ', params)
  const [{ AuthService }] = await Promise.all([import('@src/common/services')])
  const [USER_POOL_ID, CLIENT_ID] = [process.env.COGNITO_USER_POOL_ID, process.env.COGNITO_CLIENT_ID]

  if (!USER_POOL_ID && !CLIENT_ID)
    return failed({ msg: 'Cognito User Pool ID or Client ID is not defined', type: 'Internal Error' })

  // func lookup table
  const authMapping = {
    login: handleLogin,
    join: handleJoin,
    confirm: handleConfirm,
  }

  return await authMapping[params.tag](
    params,
    new AuthService(),
    new CognitoUserPool({
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
    })
  )
}

// 회원가입
export const handleJoin = async (
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
      })
  )

// 로그인
export const handleLogin = async (
  { email, password }: AuthParams,
  authService: AuthService,
  userPool: CognitoUserPool
): Promise<Try<Exception, boolean>> =>
  authService.execute<CognitoUser, Try<Exception, boolean>>(
    new CognitoUser({
      Username: email,
      Pool: userPool,
    }),
    (cognitoUser: CognitoUser) =>
      new Promise((res, rej) => {
        cognitoUser.authenticateUser(
          new AuthenticationDetails({
            Username: email,
            Password: password,
          }),
          {
            onSuccess: (result) => res(result),
            onFailure: (err) => rej(err.message),
          }
        )
      }).catch((e) => {
        throw e
      }),
    () => passed(true),
    (e) => failed({ msg: e, type: 'Invalid Params' })
  )

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
