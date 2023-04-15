# REST_API
resource "aws_api_gateway_rest_api" "lambda_rest_api" {
    name = "auth_rest_api"
}

# Gateway Resource
resource "aws_api_gateway_resource" "lambda_resource" {
    rest_api_id = aws_api_gateway_rest_api.lambda_rest_api.id
    parent_id = aws_api_gateway_rest_api.lambda_rest_api.root_resource_id
    path_part = "auth"
}

resource "aws_api_gateway_method" "example_lambda" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_rest_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource.id
  http_method   = "GET"
  authorization = "AWS_IAM" // use cognito
}

output "lambda_rest_api_id" {
    value = aws_api_gateway_rest_api.lambda_rest_api.id
}

output "lambda_resource_id" {
    value = aws_api_gateway_resource.lambda_resource.id
}