module "iam_kinesis" {
    source = "../../modules/iam/kinesis"
}

## 1. Kinesis Data Stream
resource "aws_kinesis_stream" "kinesis_stream" {
    name = "kinesis_data_stream"
    shard_count = 1
    retention_period = 24

    tags = {
        Environment = var.ENV
    }
}