resource "aws_security_group" "tech_news_sg" {
  name_prefix = "tech_news"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output AWS_SECURITY_GROUP{
    value = aws_security_group.tech_news_sg
}