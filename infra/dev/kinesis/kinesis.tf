module "iam_role" {
    source = "../../modules/iam/kinesis"
}

# Kinesis Instance
resource "aws_kinesis_stream" "kinesis_stream" {
    name = "kinesis-stream"

    # Shared 수로 요청이 처리 됨
    shard_count = 1
    retention_period = 24

    tags = {
        Environment = var.ENV
    }   

    depends_on = [
      module.iam_role.iam_kinesis   
    ]
}

# Attach Kinesis And Iam
resource "aws_iam_role_policy_attachment" "kinesis_policy_attachment" {
    policy_arn = "arn:aws:iam::aws:policy/AmazonKinesisFullAccess"
    role = module.iam_role.iam_kinesis_role
}