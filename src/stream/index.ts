import { isCommand, StreamCommand } from '@src/common/interface'
import { simpleMiddleware } from '@src/common/middlewares'
import { CommandRepository, QueryRepository } from '@src/common/repository'
import { KinesisStreamEvent, KinesisStreamRecord } from 'aws-lambda'
import _ from 'lodash'

const [JOB_COUNT, queryRepository, commandRepository] = [10, new QueryRepository(), new CommandRepository()]

export const handler = async (e: KinesisStreamEvent): Promise<void> => {
  simpleMiddleware('loggerMiddleware', e, (e) => console.log(`request per : ${e?.Records?.length}`))
  for (const job of _.chunk(e.Records, JOB_COUNT))
    await Promise.all(job.map(async (record) => await executeCQRS(record, queryRepository, commandRepository)))
}

/**
 * @param record
 */
export const executeCQRS = async (record: KinesisStreamRecord, qr: QueryRepository, cr: CommandRepository) => {
  const bufferData = JSON.parse(Buffer.from(record?.kinesis?.data, 'base64').toString('utf-8')) as StreamCommand

  // Command
  if (isCommand(bufferData)) return await cr.command(bufferData)

  // Query
  return await qr.query(bufferData)
}
