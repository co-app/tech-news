module dk_public_subnet {
    source = "../../modules/public-subnet"

    DK_VPC_ID = aws_vpc.dk_vpc.id
    DK_IGW_ID = aws_internet_gateway.dk_igw.id
    AWS_REGION = var.AWS_REGION
}

module dk_private_subnet {
    source ="../../modules/private-subnet"
    
    DK_VPC_ID = aws_vpc.dk_vpc.id
    DK_IGW_ID = aws_internet_gateway.dk_igw.id
    # DK_NAT_GATEWAY_ID = aws_nat_gateway.dk_nat_gateway.id
    AWS_REGION = var.AWS_REGION
}

## VPC
resource "aws_vpc" "dk_vpc" {
  cidr_block = "10.0.0.0/16" # 10.0.0.0 ~ 10.0.255.255
  instance_tenancy = "default"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "dk_vpc"
  }
}

## Internet-GW
resource "aws_internet_gateway" "dk_igw" {
    vpc_id = aws_vpc.dk_vpc.id
}

## Elastic ip (PROD)
# resource "aws_eip" "dk_eip" {
#   vpc = true
# }

## Nat-Gateway (PROD)
# resource "aws_nat_gateway" "dk_nat_gateway" {
#     allocation_id = aws_eip.dk_eip.id
#     subnet_id = module.dk_public_subnet.PUBLIC_SUBNET_ID
# }