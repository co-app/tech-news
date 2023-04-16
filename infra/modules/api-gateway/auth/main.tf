variable "lambda_uri" {
    type = string    
}

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

resource "aws_api_gateway_method" "lambda_method" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_rest_api.id
  resource_id   = aws_api_gateway_resource.lambda_resource.id
  http_method   = "POST"
  authorization = "AWS_IAM" // use cognito
}

# 3. Connect Lambda to API Gateway
resource "aws_api_gateway_integration" "lambda_gateway_integration" {
    rest_api_id = aws_api_gateway_rest_api.lambda_rest_api.id
    resource_id = aws_api_gateway_resource.lambda_resource.id
    http_method = "POST"
    integration_http_method = "POST"
    type = "AWS_PROXY"
    uri = var.lambda_uri
}
