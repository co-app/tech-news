
resource "aws_iam_user" "kinesis_user" {
    name = "kinesis_user"
}

resource "aws_iam_user_policy_attachment" "kinesis_iam_attachment" {
    policy_arn = "arn:aws:iam::aws:policy/AmazonKinesisFullAccess"
    user = aws_iam_user.kinesis_user.name
}