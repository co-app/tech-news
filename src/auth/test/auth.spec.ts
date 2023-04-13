import { handler } from '..'

describe('auth unit test', () => {
  it('[TEST] lambda test', (done) => {
    const auth = handler({
      httpMethod: 'GET',
      body: JSON.stringify({ message: 'hello world' }),
      headers: { 'Content-Type': 'application/json' },
    })

    console.log(auth)

    done()
  })

  it('[TEST] login handler', (done) => {
    done()
  })

  it('[TEST] signup handler => SUCCESS', (done) => {
    // const auth = {
    //   username: 'leedonggyu',
    //   password: '12341234',
    //   email: 'zkfmapf123@naver.com',
    // }
    done()
  })

  it('[TEST] signup handler => Invalid Email', (done) => {
    done()
  })

  it('[TEST] signup handler => Invalid Password', (done) => {
    done()
  })

  it('[TEST] signup handler => Invalid Username', (done) => {
    done()
  })
})
