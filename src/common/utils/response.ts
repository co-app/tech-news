/**
 * @param {p} p - response
 * @param {isSuccessFn} isSuccessFn - check if the response is success
 * @param {responseFn} responseFn - response functions object
 * @param {loggerfn} loggerfn - logger function object
 */
export const makeResponse = <T, K>(
  p: T,
  isSuccessFn: (p: T) => boolean,
  responseFn: {
    successFn: (v: T) => K
    failedFn: (e: unknown) => K
  },
  loggerfn: {
    successLogger: (v: T) => void
    errorLogger: (v: T) => void
  }
): K => {
  const { successFn, failedFn } = responseFn
  const { successLogger, errorLogger } = loggerfn
  try {
    if (isSuccessFn) return successFn(p)

    successLogger(p)
    return failedFn(p)
  } catch (e) {
    errorLogger(e)
    return failedFn(e)
  }
}
