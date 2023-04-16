variable "AWS_REGION" {
    default = "ap-northeast-2"
}

variable "AWS_ACCESS_KEY" {
    type = string
}
variable "AWS_SECRET_KEY" {
    type = string
}

variable "ENV" {
    type = string
    default = "dev"
}

variable "FUNC_NAME" {
    type = string
}
