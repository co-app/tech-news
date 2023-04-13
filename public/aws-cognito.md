## AWS Cognito

### Desc

- 대표적인 IDDS 서비스
- Firebase Authentication 등이 존재
- 기본적인 Oauth 2.0 제공

### Pool

> 사용자 풀 (Todo)

    - 일반적인 로그인, 회원가입, 유저 프로필 기능 구현

> 자격 증명 풀 (Later)

    - 특정 사용자에게 AWS IAM권한을 부여

### User Pool (사용자 풀)

- 기본적인 Admin Dashboard 제공
- \*\*Lambda, AWS 서비스제공
- 페이스북이나 구글같은 외부 ID제공업체가 통합가능 (Social Login)
- 앱, 서버, SPA 클라이언트에 인증기능 연동

### More Authentication...

> OAuth2

    - 서로 다른 어플리케이션간의 접근권한을 위임하기 위한 프로토콜

> OIDC

    - OAuth2를 기반으로 인증도 같이 진행할수있는 프로토콜 (인증 + 인가)

> OAuth2 + OIDC를 사용한다면 이점

    - 다른 언어를 사용하더라도, 기술스택의 구애받지 않고 인증을 구현할 수 있다.
    - Node, Golang, React ...
