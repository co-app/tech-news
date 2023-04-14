/**
 * @desc stateless
 */
export class AuthService {
  execute = async <P, R>(
    params: P,
    signupFn: (params: P) => Promise<unknown>,
    successFn: () => R,
    failedFn: (e: string) => R
  ): Promise<R> => {
    try {
      await signupFn(params)
      return successFn()
    } catch (e) {
      return failedFn(e)
    }
  }
}
