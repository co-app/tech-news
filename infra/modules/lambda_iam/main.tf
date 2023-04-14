variable "iam_name" {
    type = string   
    default = "iam_lambda"
}

variable "func_name" {
    type = string
}

variable "aws_region" {
    type = string
}

variable "ASSUME_ROLE_POLICY" {
    type = string
    
    default = <<EOF
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "sts:AssumeRole",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },  
                "Effect": "Allow",
                "Sid": ""
            }
        ]
    }
    EOF
}

# Lambda IAM Role
resource "aws_iam_role" "iam_lambda" {
    name = "${var.func_name}-${var.aws_region}"
    assume_role_policy = var.ASSUME_ROLE_POLICY
}

## Cloud Watch Attachment
resource "aws_iam_role_policy_attachment" "cloudwatch_logs" {
    role = aws_iam_role.iam_lambda.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

## VPC Attachment
# resource "aws_iam_role_policy_attachment" "vpc_attachment" {
#   count = length(var.vpc_config) < 1 ? 0 : 1
#   role  = aws_iam_role.lambda.name

#   // see https://docs.aws.amazon.com/lambda/latest/dg/vpc.html
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
# }


output "iam_arn" {
    description = "value of iam_arn"
    value = aws_iam_role.iam_lambda.arn
}
