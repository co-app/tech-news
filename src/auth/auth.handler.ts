import { CognitoUserPool } from 'amazon-cognito-identity-js'
import { AuthParams } from './auth.dto'

interface HandlerParmas {
  params: Omit<AuthParams, 'tag'>
  userPool: CognitoUserPool
}

// export const loginHandler = () => {}

export const signUpHandler = async ({ params, userPool }: HandlerParmas) => {
  try {
    // const [AuthService] = await Promise.all(['@src/common/services/auth.service'])
  } catch (e) {
    console.error(e)
  }
}
