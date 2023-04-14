export class AuthService<P, R> {
  async signup(params: P, signupFn: (params: P) => Promise<unknown>, successFn: () => R, failedFn: (e: unknown) => R) {
    try {
      await signupFn(params)
      return successFn()
    } catch (e) {
      return failedFn(e)
    }
  }
}
