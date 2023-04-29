## Lambda IAM
resource "aws_iam_role" "iam_lambda" {
    name = "${var.FUNC_NAME}_${var.AWS_REGION}"
    assume_role_policy = <<EOF
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

## Cloud Watch Attachment
resource "aws_iam_role_policy_attachment" "lambda_cloud_watch_logs" {
    role = aws_iam_role.iam_lambda.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
