output "LAMBDA_FUNC" {
    description = "value of lambda_func"
    value = try(var.FUNC_NAME, "")
}

output "LAMBDA_FUNCTION_DETAILS" {
    description = "value of lambda_function_details"
    value = aws_lambda_function.lambda_function
}
