import { StreamCommand } from '@src/common/interface'
import { simpleMiddleware } from '@src/common/middlewares'
import { CQRSRepository } from '@src/common/repository'
import { KinesisStreamEvent, KinesisStreamRecord } from 'aws-lambda'
import _ from 'lodash'

const [JOB_COUNT, repository] = [10, new CQRSRepository()]

export const handler = async (e: KinesisStreamEvent): Promise<void> => {
  simpleMiddleware('loggerMiddleware', e, (e) => console.log(`request per : ${e?.Records?.length}`))
  for (const job of _.chunk(e.Records, JOB_COUNT))
    await Promise.all(job.map(async (record) => await executeCQRS(record, repository)))
}

/**
 * @command DynamoDB - Later
 * @query AuroraDB (Serverless)
 *
 * @param record
 */
export const executeCQRS = async (record: KinesisStreamRecord, repo: CQRSRepository<StreamCommand>) => {
  const bufferData = JSON.parse(Buffer.from(record?.kinesis?.data, 'base64').toString('utf-8')) as StreamCommand

  // Command
  // if (isCommand(bufferData)) {
  //   return await repo.execute(bufferData, null, null, null, null)
  // }

  return await repo.execute(bufferData, null, null, null, null)
}
