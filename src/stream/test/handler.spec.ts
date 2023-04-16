import fs from 'fs'
import path from 'path'
import { executeCQRS } from '..'
import { Command, makeCommand, makeQuery } from '../../common/interface'
import { CQRSRepository } from '../../common/repository'

describe('stream handler test', () => {
  const repository = new CQRSRepository()
  const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock.json'), 'utf-8'))

  const kinesisDataStreamRequest = jest.fn((data) => {
    const streamData = mockData['kinesis_data_stream']
    streamData.Records[0].kinesis.data = data

    return {
      ...streamData,
    }
  })

  beforeEach(() => {
    jest.spyOn(repository, 'execute').mockImplementation(async (c: Command): Promise<any> => c)
  })

  it('[TEST] Data Parsing Test', (done) => {
    const STR = 'hello world'
    const data = kinesisDataStreamRequest(STR)
    expect(data['Records'][0].kinesis.data).toBe(STR)
    done()
  })

  it('[TEST] command query', async () => {
    const commandQuery = JSON.stringify(makeQuery("insert into test values (1, 'test')"))
    const query = kinesisDataStreamRequest(Buffer.from(commandQuery).toString('base64'))
    const v = await executeCQRS(query.Records[0], repository)

    expect(v).toMatchObject({
      type: 'Query',
      eventType: 'update',
      query: "insert into test values (1, 'test')",
    })
  })

  it('[TEST] invalid command', async () => {
    const commandQuery = JSON.stringify(makeCommand("insert into test values (1, 'test')"))
    const query = kinesisDataStreamRequest(Buffer.from(commandQuery).toString('base64'))
    const v = await executeCQRS(query.Records[0], repository)

    expect(v).toMatchObject({
      type: 'Command',
      eventType: 'create',
      query: "insert into test values (1, 'test')",
    })
  })
})
