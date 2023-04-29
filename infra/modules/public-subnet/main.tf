## Public Subnet (1 ~ 100)
resource "aws_subnet" "dk_public_subnet" {
  vpc_id = var.DK_VPC_ID
  cidr_block = "10.0.1.0/24" ## 10.0.1.0 ~ 10.0.1.255
  availability_zone = "${var.AWS_REGION}a"

  tags = {
    Name = "dk_public_subnet"
  }
}

## Route Table
resource "aws_route_table" "dk_public_rt" {
    vpc_id = var.DK_VPC_ID
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = "${var.DK_IGW_ID}"
    }
}

## Mapping Route Table & Public Subnet
resource "aws_route_table_association" "dk_public_1" {
    subnet_id = "${aws_subnet.dk_public_subnet.id}"
    route_table_id = "${aws_route_table.dk_public_rt.id}"
}

output "PUBLIC_SUBNET_ID" {
    value = aws_subnet.dk_public_subnet.id
}