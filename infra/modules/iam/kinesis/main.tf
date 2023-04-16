resource "aws_iam_role" "iam_kinesis" {
    name = "iam_kinesis"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
        {
            Action = "sts:AssumeRole"
            Effect = "Allow"
            Principal = {
            Service = "kinesis.amazonaws.com"
            }
        }
        ]
    })
}

output "iam_kinesis_role" {
    value = aws_iam_role.iam_kinesis.name
}