module "iam_role" {
    source = "../../modules/iam/lambda"

    IAM_NAME = "iam_lambda"   
    FUNC_NAME = var.FUNC_NAME
    AWS_REGION = var.AWS_REGION
}

# module "api_gateway" {

# }

## Lambda Layer
resource "aws_lambda_layer_version" "lambda_layer" {
    filename = "../../../layer.zip"
    layer_name = "${var.FUNC_NAME}_layer"
    compatible_runtimes = ["nodejs14.x"]
}

## Lambda Function
resource "aws_lambda_function" "lambda_function" {
    filename = "../../../lambda.zip"
    function_name = var.FUNC_NAME
    role = module.iam_role.IAM_LAMBDA.arn
    handler = "lib/${var.FUNC_NAME}.handler"
    runtime = "nodejs14.x"
    memory_size = 128
    timeout = 60

    source_code_hash = "${filebase64sha256("../../../lambda.zip")}"
    layers = [aws_lambda_layer_version.lambda_layer.arn]
}

## Lambda Permission
resource "aws_lambda_layer_version_permission" "lambda_layer_permission" {
    statement_id  = "AllowLambdaToUseMyLayer"
    action        = "lambda:GetLayerVersion"
    layer_name    = "${var.FUNC_NAME}_layer"
    principal     = "*"
    version_number = aws_lambda_layer_version.lambda_layer.version
}
