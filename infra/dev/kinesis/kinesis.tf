module "iam_lambda" {
    source = "../../modules/iam/lambda"

    aws_region = var.AWS_REGION
    func_name = var.FUNC_NAME
}

module "iam_kinesis" {
    source = "../../modules/iam/kinesis"

    kinesis_arn = aws_kinesis_stream.kinesis_stream.arn
    lambda_role = module.iam_lambda.iam_name
}

###################### 1. Kinesis Data Stream ######################
resource "aws_kinesis_stream" "kinesis_stream" {
    name = "kinesis_data_stream"
    shard_count = 1
    retention_period = 24

    tags = {
        Environment = var.ENV
    }
}

####################### 2. Stream Lambda Function ######################

## Layer 
resource "aws_lambda_layer_version" "stream_labmda_layer" {
    filename = "../../../layer.zip"
    layer_name = "${var.FUNC_NAME}_Layer"

    compatible_runtimes = ["nodejs14.x"]
}

## Lambda
resource "aws_lambda_function" "stream_lambda_tf" {
    filename = "../../../lambda.zip"
    function_name = var.FUNC_NAME
    description = "kinesis data stream to database"
    role = module.iam_lambda.iam_arn
    handler = "lib/${var.FUNC_NAME}.handler"
    runtime = "nodejs14.x"
    memory_size = 128 # MB
    timeout = 60 # seconds

    source_code_hash = "${filebase64sha256("../../../lambda.zip")}"
    layers =  [aws_lambda_layer_version.stream_labmda_layer.arn]
}

## Permission
resource "aws_lambda_layer_version_permission" "my_layer_permission" {
  statement_id  = "AllowLambdaToUseMyLayer"
  action        = "lambda:GetLayerVersion"
  layer_name    = "${var.FUNC_NAME}_Layer"
  principal     = "*"
  version_number = aws_lambda_layer_version.stream_labmda_layer.version
}

####################### 3. Event Source Mapping ######################
resource "aws_lambda_event_source_mapping" "kinesis_mapping" {
    event_source_arn = aws_kinesis_stream.kinesis_stream.arn
    function_name = aws_lambda_function.stream_lambda_tf.arn

    ## Config
    batch_size = 10
    starting_position = "LATEST"
}
