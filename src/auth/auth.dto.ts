export interface AuthParams {
  tag: 'login' | 'join'
  username: string
  email: string
  password: string
}
