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
    default = "dev"
}

# plan & apply 시 console에 입력
variable "FUNC_NAME" {
       
}

variable "FUNC_DESC" {

}