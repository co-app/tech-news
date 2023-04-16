import { StreamCommand } from '../interface'

export class CQRSRepository<T extends StreamCommand> {
  execute = async <A, K extends void>(
    cq: T,
    fn: (cq: T) => A,
    cond: (a: A) => boolean,
    successFn: (a: A) => Promise<K>,
    failFn: (a: A) => Promise<K>
  ): Promise<K> => {
    const result = await fn(cq)
    if (cond(result)) {
      return await successFn(result)
    }

    return await failFn(result)
  }
}
