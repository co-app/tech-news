## VPC
resource "aws_vpc" "dk_vpc" {
  id = var.AWS_VPC_ID
}

resource "aws_subnet" "dk_private_subnet" {
    id = var.AWS_PRIVATE_SUBNET_ID
    vpc_id = aws_vpc.dk_vpc.id
}

## Module
module aurora_sg {
    source ="../../modules/security-group/aurora"
}


## Instance
resource "aws_rds_cluster" "tech_news_cluster" {
    engine = "aurora"
    engine_mode = "serverless"
    database_name = "tech_news"
    master_username = "admin"
    master_password = var.AWS_MYSQL_PASSWORD

    backup_retention_period = 7
    skip_final_snapshot = false

    ## Network
    vpc_security_group_ids = [module.aurora_sg.AWS_SECURITY_GROUP.id]
    db_subnet_group_name = []

    scaling_configuration {
      auto_pause =true
      max_capacity = 2
      min_capacity = 1
      seconds_until_auto_pause = 300
    }
} 

resouce "aws_rds_cluster_instance" "tech_news_cluster_instance" {
    clsuter_identifier = aws_rds_cluster.tech_news_cluster.id
    instance_class = "db.t2.micro"
    engine = "aurora"
    db_subnet_group_name = ""
}
