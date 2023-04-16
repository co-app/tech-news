/**
 * 추후 CQRS Pattern 고려
 * 현재는 Query로만 진행
 */

export interface Command {
  type: 'Command'
  eventType: 'create'
  desc?: string
  query: string
}

export interface Query {
  type: 'Query'
  eventType: 'update' | 'delete'
  desc?: string
  query: string
}

export type StreamCommand = Command | Query

export const makeCommand = (query: string, desc?: string): Command => ({
  type: 'Command',
  eventType: 'create',
  desc,
  query,
})

export const makeQuery = (query: string, desc?: string): Query => ({
  type: 'Query',
  eventType: 'update',
  desc,
  query,
})

export const isCommand = (sc: StreamCommand): sc is Command => sc.type === 'Command'
export const isQuery = (sc: StreamCommand): sc is Query => sc.type === 'Query'
