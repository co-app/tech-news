import { handler } from '..'

describe('auth unit test', () => {
  describe('auth middleaware test', () => {
    it('[TEST] signup handler => Invalid Email', async () => {
      await handler({
        httpMethod: 'GET',
        body: JSON.stringify({ tag: 'join', username: 'test', email: 'test', password: 'test' }),
        headers: { 'Content-Type': 'application/json' },
      }).catch((e) => {
        expect(e._tag).toBe('fail')
        expect(e.error.message).toBe('"email" must be a valid email')
      })
    })
    it('[TEST] signup handler => Invalid Password', async () => {
      await handler({
        httpMethod: 'GET',
        body: JSON.stringify({ tag: 'join', username: 'test', email: 'zkfmapf123@naver.com', password: '' }),
        headers: { 'Content-Type': 'application/json' },
      }).catch((e) => {
        expect(e._tag).toBe('fail')
        expect(e.error.message).toBe('"password" is not allowed to be empty')
      })
    })
    it('[TEST] signup handler => Invalid Username', async () => {
      await handler({
        httpMethod: 'GET',
        body: JSON.stringify({ tag: 'join', username: '', email: 'test', password: '12341234' }),
        headers: { 'Content-Type': 'application/json' },
      }).catch((e) => {
        expect(e._tag).toBe('fail')
        expect(e.error.message).toBe('"username" is not allowed to be empty')
      })
    })
  })
})
