## Terraform

### Lambda 특성 상, 여러 함수가 배포가 될때 (terraform workspace)

```hcl
    terraform workspace create auth
    terraform workspace show
    terraform worksapce select auth
    ...
```

### A 폴더에서 이미 VPC를 구성하고, B 폴더에서 해당 VPC를 사용해야 할 경우 (import)

1. B 폴더에서 init

```hcl
    resource "aws_vpc" "exmaple" {
        id = ""
    }

    resource "aws_subnet" "example_subnet" {
        id = ""
        vpc_id = aws_vpc.example.id
    }
```

2. 실제 id로 import

```bash
    terraform import aws_vpc.example <vpc-id>
    terraform import aws_subnet.exmaple_subnet <subnet-id>
```
