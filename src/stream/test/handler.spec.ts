import fs from 'fs'
import path from 'path'
import { executeCQRS } from '..'
import { Command, makeCommand, makeQuery, Query } from '../../common/interface'
import { CommandRepository, QueryRepository } from '../../common/repository'

describe('stream handler test', () => {
  const commandRepository = new CommandRepository()
  const queryRepository = new QueryRepository()
  const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock.json'), 'utf-8'))

  const kinesisDataStreamRequest = jest.fn((data) => {
    const streamData = mockData['kinesis_data_stream']
    streamData.Records[0].kinesis.data = data

    return {
      ...streamData,
    }
  })

  beforeEach(() => {
    jest.spyOn(commandRepository, 'command').mockImplementation(async (c: Command): Promise<any> => c)
    jest.spyOn(queryRepository, 'query').mockImplementation(async (q: Query): Promise<any> => q)
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
    const v = await executeCQRS(query.Records[0], queryRepository, commandRepository)

    expect(v).toMatchObject({
      type: 'Query',
      eventType: 'update',
      query: "insert into test values (1, 'test')",
    })
  })

  it('[TEST] invalid command', async () => {
    const commandQuery = JSON.stringify(makeCommand("insert into test values (1, 'test')"))
    const query = kinesisDataStreamRequest(Buffer.from(commandQuery).toString('base64'))
    const v = await executeCQRS(query.Records[0], queryRepository, commandRepository)

    expect(v).toMatchObject({
      type: 'Command',
      eventType: 'create',
      query: "insert into test values (1, 'test')",
    })
  })
})
