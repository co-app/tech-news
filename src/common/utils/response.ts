/**
 * @desc Handler 작업이후 성공/실패 관련된 Func를 작성합니다.
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
    if (isSuccessFn(p)) return successFn(p)

    successLogger(p)
    return failedFn(p)
  } catch (e) {
    errorLogger(e)
    return failedFn(e)
  }
}

/**
 * @desc 람다 함수에 맞춘 Rseponse를 작성합니다
 */
export const statusToRespone = <T>(status: number, msg: T) => ({
  statusCode: status,
  body: JSON.stringify(msg),
})
