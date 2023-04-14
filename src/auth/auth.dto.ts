/**
 * @param {tag} tag 회원가입, 로그인, 이메일 인증
 */
export interface AuthParams {
  tag: 'login' | 'join' | 'confirm'
  username: string
  email: string
  password: string
  verification_code?: string
}
