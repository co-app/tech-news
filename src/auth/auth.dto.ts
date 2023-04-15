import { szModel, szParam } from 'huelgo-sz'
/**
 * @param {tag} tag 회원가입, 로그인, 이메일 인증
 */
export interface AuthParams {
  tag: 'login' | 'join' | 'confirm'
  username?: string
  email: string
  password?: string
  verification_code?: string
}

export const authParamSchema = ({ tag, username, email, password, verification_code }: AuthParams) =>
  szModel({
    tag: szParam().set(tag, 'tag').string().include(['login', 'join', 'confirm']).required(),
    username: szParam().set(username, 'username'),
    email: szParam().set(email, 'email').required(),
    password: szParam().set(password, 'password'),
    verificationCode: szParam().set(verification_code, 'verification_code'),
  })
