# use Iam Module
module "iam_role" {
    source = "../modules/iam"

    ## Variables
    func_name = var.FUNC_NAME
    aws_region = var.AWS_REGION
}

# Lambda Layer 
resource "aws_lambda_layer_version" "lambda_layer" {
    filename = "../../layer.zip"
    layer_name = "${var.FUNC_NAME}_Layer"
    # source_code_hash = "${filebase64sha256("../../layer.zip")}"

    compatible_runtimes = ["nodejs14.x"]
}


# Lambda Function
resource "aws_lambda_function" "lambda_tf" {
    filename = "../../lambda.zip"
    function_name = var.FUNC_NAME
    description = var.FUNC_DESC
    role = module.iam_role.iam_arn
    handler = "lib/${var.FUNC_NAME}.handler"
    runtime = "nodejs14.x"
    memory_size = 128 # MB
    timeout = 60 # seconds

    source_code_hash = "${filebase64sha256("../../lambda.zip")}"
    layers =  [aws_lambda_layer_version.lambda_layer.arn]
}

# Permission Lambda Later
# principal ex) arn:aws:iam::123456789012:role/lambda-role
resource "aws_lambda_layer_version_permission" "my_layer_permission" {
  statement_id  = "AllowLambdaToUseMyLayer"
  action        = "lambda:GetLayerVersion"
  layer_name    = "${var.FUNC_NAME}_Layer"
  principal     = "*"
  version_number = aws_lambda_layer_version.lambda_layer.version
}

# Output
output "lambda_func" {
    description = "value of lambda_func"
    value = try(var.FUNC_NAME, "")
}

output "lambda_func_desc" {
    description = "value of lambda_func_desc"
    value = try(var.FUNC_DESC, "")
}

output "lambda_function_details" {
    description = "value of lambda_function_details"
    value = aws_lambda_function.lambda_tf
}