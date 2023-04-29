## Pirvate Subnet (101 ~ 255)
resource "aws_subnet" "dk_private_subnet" {
    vpc_id = var.DK_VPC_ID
    cidr_block = "10.0.101.0/24"
    availability_zone = "${var.AWS_REGION}a"

    tags = {
        Name = "dk_private_subnet"
    }
}

## Route Table 
resource "aws_route_table" "dk_private_rt" {
    vpc_id = var.DK_VPC_ID

    route {
        cidr_block ="0.0.0.0/0"
        // nat_gateway_id = var.DK_NAT_GATEWAY_ID (PROD)
        gateway_id = var.DK_IGW_ID // dev
    }
}

resource "aws_route_table_association" "dk_private_1" {
    subnet_id = "${aws_subnet.dk_private_subnet.id}"
    route_table_id = "${aws_route_table.dk_private_rt.id}"
}