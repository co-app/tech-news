# Tech-news (진행중...)

## Desc

- 원하는 카테고리의 뉴스나 새로운 소식을 먼저 접해보자!!
- Channel
  - Email
  - 텔레그램
  - 카카오톡

## Use Terraform

```
  // Lambda 함수 배포
  source alias.sh
  cd infra/dev/lambda
  tf init && tf plan -var-file="../tf.tfvars"
```

## Flow

![arch](./public/arch.png)
![flow](./public/flow.png)

## Todo

> 기능

- [x] 유저 인증
  - [x] 회원가입
    - [ ] 회원가입 (before verification) DB 입력
  - [x] 로그인
  - [x] 이메일 확인
    - [ ] 이메일 확인 못 받은 이메일 삭제 (DB)
- [ ] 유저 채널 관리
- [ ] 스케쥴링
- [ ] 스케쥴링 실패 시 -> fail 관리

> Function

- Lambda

  - [ ] Auth (Cognito)
  - [ ] 설정

- EC2

  - [ ] Crawling (Puppeteer)
  - [ ] Optimize Crawling

> Cloud

- [ ] Setting AWS Lambda use Terraform

  - [x] Lambda
  - [ ] API Gateway (each Function)
  - [ ] Aurora Database
  - [ ] Kinesis

- [ ] Schduler

## Desc

- 카테고리 체크
- 코드 검색
- 코드 결과 반환
- 카테고리 추천

## DB Schema

![schema](./public/db_schema.png)

## Reference

<a href="https://github.com/co-app/tech-news/issues/1">중재자 역할을 Kinesis로 사용한 이유</a>
