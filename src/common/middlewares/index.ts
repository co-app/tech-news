/**
 * @desc 실행만 하는 간단한 미들웨어
 * @param e Event
 * @param fn 실행 함수 (간단)
 */
export const simpleMiddleware = <Event>(e: Event, fn: (e: Event) => void) => fn(e)

/**
 * @desc 유효성 검사 및 실행 함수를 진행하는 미들웨어
 * @param title middleware 이름
 * @param e Event
 * @param executeFn 실행 함수
 * @param condFn 조건 함수
 * @param successFn 조건 성공 시
 * @param failFn 조건 실패 시
 * @returns
 */
export const commonMiddleware = <Event, A, B, C, D>(
  title: string,
  e: Event,
  executeFn: (e: Event) => A,
  condFn: (r: A) => B,
  successFn: (r: A) => C,
  failFn: (r: A) => D
): C | D => {
  console.log('middleware : ', title)
  const result = executeFn(e)
  const cond = condFn(result)

  if (cond) {
    return successFn(result)
  }

  return failFn(result)
}
