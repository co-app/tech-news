variable AWS_RDS_CIDR_BLOCK {}
variable AWS_VPC_ID {}

resource "aws_security_group" "tech_news_sg" {
  name_prefix = "tech_news"
  vpc_id = var.AWS_VPC_ID

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.AWS_RDS_CIDR_BLOCK]
  }
}

output AWS_SECURITY_GROUP {
    value = aws_security_group.tech_news_sg
}