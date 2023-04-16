variable "kinesis_arn" {
    
}

variable "lambda_role" {

}

resource "aws_iam_policy" "kinesis_policy" {
    name = "lambda_kinesis_policy"
    
    policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow",
        Action    = [
          "kinesis:GetShardIterator",
          "kinesis:GetRecords",
          "kinesis:DescribeStream"
        ],
        Resource  = var.kinesis_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_kinesis_attachment" {
    policy_arn = aws_iam_policy.kinesis_policy.arn
    role = var.lambda_role
}
