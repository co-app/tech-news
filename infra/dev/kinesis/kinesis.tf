module "iam_role" {
    source = "../../modules/kinesis_iam"

    aws_region = var.AWS_REGION
}

# Kinesis Instance
resource "aws_kinesis_stream" "kinesis_stream" {
    name = "kinesis-stream"
}