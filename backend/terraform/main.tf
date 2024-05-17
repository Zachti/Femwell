terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "wolverine_ecr_repo" {
  name = "wolverine"
}

resource "aws_ecr_repository" "denden_ecr_repo" {
  name = "denden"
}

resource "aws_ecr_repository" "vault_ecr_repo" {
  name = "vault"
}

resource "aws_ecr_repository" "heimdall_ecr_repo" {
  name = "heimdall"
}

resource "aws_ecs_cluster" "femwell" {
  name = "femwell"
}

data "aws_iam_role" "existing" {
  name = "LabRole"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "femwell-main-bucket"
  acl    = "private"

}

resource "aws_cognito_user_pool" "femwell_user_pool" {
  name = "femwell-user-pool"

  password_policy {
    minimum_length    = 7
    require_lowercase = false
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes = ["email"]

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 5
      max_length = 254
    }
  }

  auto_verified_attributes = ["email"]
   mfa_configuration = "OFF"
}

resource "aws_cognito_user_pool_client" "femwell_client_pool" {
  name = "femwell-client-pool"

  user_pool_id = aws_cognito_user_pool.femwell_user_pool.id

  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]

  callback_urls = ["https://google.com"]

  allowed_oauth_flows_user_pool_client = true
  generate_secret                      = false
}

# resource "aws_rds_cluster" "aurora_cluster" {
#   cluster_identifier      = "aurora-cluster"
#   engine                  = "aurora-postgresql"
#   engine_version          = "15.4"
#   availability_zones      = ["us-east-1a"]
#   database_name           = "femdb"
#   master_username         = "zach"
#   master_password         = "zach1234"
#   backup_retention_period = 2
#   preferred_backup_window = "07:00-09:00"
#   skip_final_snapshot     = true
# }

# resource "aws_rds_cluster_instance" "aurora_instance" {
#   identifier         = "aurora-instance"
#   cluster_identifier = aws_rds_cluster.aurora_cluster.id
#   instance_class     = "db.t3.medium"
#   engine             = "aurora-postgresql"
# }

resource "aws_cloudwatch_log_group" "femwell_task_log_group" {
  name = "/ecs/femwell-task"
}


# resource "aws_ecs_task_definition" "femwell_task" {
#   family                   = "femwell-task"
#   container_definitions    = jsonencode(
#   [
#     {
#       name: "femwell-task-wolverine",
#       image: aws_ecr_repository.wolverine_ecr_repo.repository_url,
#       essential: true,
#       portMappings: [
#         {
#           "containerPort": 3001,
#           "hostPort": 3001
#         }
#       ],
#       environment = [
#         {
#           name = "AWS_REGION"
#           value = "us-east-1"
#         },
#         {
#           name = "AWS_ACCESS_KEY"
#           value = "xxxxx"
#         },
#         {
#           name = "AWS_SECRET_KEY"
#           value = "xxxxx"
#         },
#         {
#           name = "AWS_SESSION_TOKEN"
#           value = "xxxxx"
#         },
#         {
#           name  = "LOG_LEVEL"
#           value = var.LOG_LEVEL
#         },
#         {
#           name  = "NODE_ENV"
#           value = var.NODE_ENV
#         },
#         {
#           name  = "STREAM_ARN"
#           value = var.STREAM_ARN
#         },
#         {
#           name  = "COGNITO_USER_POOL_ID"
#           value = aws_cognito_user_pool.femwell_user_pool.id
#         },
#         {
#           name  = "COGNITO_CLIENT_ID"
#           value = aws_cognito_user_pool_client.femwell_client_pool.id
#         },
#         {
#           name  = "PORT"
#           value = var.WOLVERINE_PORT
#         },
#         {
#           name  = "AWS_AURORA_URL"
#           value = "mysql://leibo-secure.fake.com"
#         }
#       ],
#       logConfiguration: {
#         logDriver: "awslogs",
#         options: {
#           "awslogs-group": "/ecs/femwell-task",
#           "awslogs-region": "us-east-1", // replace with your region
#           "awslogs-stream-prefix": "ecs"
#         }
#       },
#       memory: 512,
#       cpu: 256
#     },
    # {
    #   name: "femwell-task-vault",
    #   image: aws_ecr_repository.vault_ecr_repo.repository_url,
    #   essential: true,
    #   portMappings: [
    #     {
    #       "containerPort": 3002,
    #       "hostPort": 3002
    #     }
    #   ],
    #   environment = [
    #     {
    #       name  = "LOG_LEVEL"
    #       value = var.LOG_LEVEL
    #     },
    #     {
    #       name  = "NODE_ENV"
    #       value = var.NODE_ENV
    #     },
    #     {
    #       name  = "STREAM_ARN"
    #       value = var.STREAM_ARN
    #     },
    #     {
    #       name  = "COGNITO_USER_POOL_ID"
    #       value = aws_cognito_user_pool.femwell_user_pool.id
    #     },
    #     {
    #       name  = "COGNITO_CLIENT_ID"
    #       value = aws_cognito_user_pool_client.femwell_client_pool.id
    #     },
    #     {
    #       name  = "PORT"
    #       value = var.VAULT_PORT
    #     },
    #     {
    #       name  = "WOLVERINE_ENDPOINT"
    #       value = var.WOLVERINE_ENDPOINT
    #     }
    #   ],
    #   memory: 512,
    #   cpu: 256
    #   logConfiguration: {
    #     logDriver: "awslogs",
    #     options: {
    #       "awslogs-group": "/ecs/femwell-task",
    #       "awslogs-region": "us-east-1", // replace with your region
    #       "awslogs-stream-prefix": "ecs"
    #     }
    #   },
    # },
    # {
    #   name: "femwell-task-heimdall",
    #   image: aws_ecr_repository.heimdall_ecr_repo.repository_url,
    #   essential: true,
    #   portMappings: [
    #     {
    #       "containerPort": 3003,
    #       "hostPort": 3003
    #     }
    #   ],
    #    environment = [
    #     {
    #       name  = "LOG_LEVEL"
    #       value = var.LOG_LEVEL
    #     },
    #     {
    #       name  = "NODE_ENV"
    #       value = var.NODE_ENV
    #     },
    #     {
    #       name  = "STREAM_ARN"
    #       value = var.STREAM_ARN
    #     },
    #     {
    #       name  = "COGNITO_USER_POOL_ID"
    #       value = aws_cognito_user_pool.femwell_user_pool.id
    #     },
    #     {
    #       name  = "COGNITO_CLIENT_ID"
    #       value = aws_cognito_user_pool_client.femwell_client_pool.id
    #     },
    #     {
    #       name  = "PORT"
    #       value = var.HEIMDALL_PORT
    #     },
    #     {
    #       name  = "AWS_BUCKET"
    #       value = aws_s3_bucket.bucket.bucket
    #     },
    #     {
    #       name  = "BUCKET_LOCATION_BASE_FOLDER"
    #       value = var.BUCKET_LOCATION_BASE_FOLDER
    #     },
    #     { 
    #       name  = "MAX_FILE_SIZE"
    #       value = var.MAX_FILE_SIZE
    #     },
    #     {
    #       name  = "AWS_S3_ENDPOINT"
    #       value = "s3.us-east-1.amazonaws.com"
    #     },
    #     {
    #       name  = "S3_CHECKLIST_KEY"
    #       value = var.S3_CHECKLIST_KEY
    #     },
    #     {
    #       name  = "SUPPORT_EMAIL"
    #       value = var.SUPPORT_EMAIL
    #     }
    #   ],
    #   memory: 512,
    #   cpu: 256
    #   logConfiguration: {
    #     logDriver: "awslogs",
    #     options: {
    #       "awslogs-group": "/ecs/femwell-task",
    #       "awslogs-region": "us-east-1", // replace with your region
    #       "awslogs-stream-prefix": "ecs"
    #     }
    #   },
    # },
    # {
    #   name: "femwell-task-denden",
    #   image: aws_ecr_repository.denden_ecr_repo.repository_url,
    #   essential: false,
    #   portMappings: [
    #     {
    #       "containerPort": 3004,
    #       "hostPort": 3004
    #     }
    #   ],
    #    environment = [
    #     {
    #       name  = "LOG_LEVEL"
    #       value = var.LOG_LEVEL
    #     },
    #     {
    #       name  = "NODE_ENV"
    #       value = var.NODE_ENV
    #     },
    #     {
    #       name  = "STREAM_ARN"
    #       value = var.STREAM_ARN
    #     },
    #     {
    #       name  = "COGNITO_USER_POOL_ID"
    #       value = aws_cognito_user_pool.femwell_user_pool.id
    #     },
    #     {
    #       name  = "COGNITO_CLIENT_ID"
    #       value = aws_cognito_user_pool_client.femwell_client_pool.id
    #     },
    #     {
    #       name  = "PORT"
    #       value = var.DENDEN_PORT
    #     },
    #     {
    #       name  = "AWS_CLOUD_FRONT_ENDPOINT"
    #       value = var.AWS_CLOUD_FRONT_ENDPOINT
    #     },
    #     {
    #       name  = "AWS_CLOUD_FRONT_DISTRIBUTION_ID"
    #       value = var.AWS_CLOUD_FRONT_DISTRIBUTION_ID
    #     }
    #   ],
    #   memory: 512,
    #   cpu: 256
    # }
#   ])
#   requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
#   network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
#   memory                   = 2048         # Specify the memory the container requires
#   cpu                      = 1024         # Specify the CPU the container requires
#   runtime_platform {
#   operating_system_family = "LINUX"
#   cpu_architecture        = "X86_64"
#   }
#   execution_role_arn       = data.aws_iam_role.existing.arn
# }

# resource "aws_ecs_service" "femwell_service" {
#   name            = "femwell"     # Name the service
#   cluster         = aws_ecs_cluster.femwell.id   # Reference the created Cluster
#   task_definition = aws_ecs_task_definition.femwell_task.arn # Reference the task that the service will spin up
#   launch_type     = "FARGATE"
#   desired_count   = 1

#   deployment_controller {
#     type = "ECS"
#   }

#   deployment_maximum_percent         = 100
#   deployment_minimum_healthy_percent = 0

#   network_configuration {
#     subnets          = module.vpc.public_subnets 
#     assign_public_ip = true     # Provide the containers with public IPs
#     security_groups  = [aws_security_group.alb.id] # Set up the security group
#   }
# }

resource "aws_alb" "femwell_load_balancer" {
  name               = "load-balancer-femwell"
  load_balancer_type = "application"
  subnets = module.vpc.public_subnets
  security_groups = [aws_security_group.alb.id]
}

resource "aws_lb_target_group" "wolverine_target_group" {
  name     = "wolverine-target-group"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
}

resource "aws_lb_target_group" "vault_target_group" {
  name     = "vault-target-group"
  port     = 3002
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
}

resource "aws_lb_target_group" "heimdall_target_group" {
  name     = "heimdall-target-group"
  port     = 3003
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
}

resource "aws_lb_target_group" "denden_target_group" {
  name     = "denden-target-group"
  port     = 3004
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_alb.femwell_load_balancer.arn #  load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "404: Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "wolverine_listener_rule" {
  listener_arn = aws_lb_listener.listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.wolverine_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/wolverine/*"]
    }
  }
}

resource "aws_lb_listener_rule" "vault_listener_rule" {
  listener_arn = aws_lb_listener.listener.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.vault_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/vault/*"]
    }
  }
}

resource "aws_lb_listener_rule" "heimdall_listener_rule" {
  listener_arn = aws_lb_listener.listener.arn
  priority     = 300

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.heimdall_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/heimdall/*"]
    }
  }
}

resource "aws_lb_listener_rule" "denden_listener_rule" {
  listener_arn = aws_lb_listener.listener.arn
  priority     = 400

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.denden_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/denden/*"]
    }
  }
}


module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "femwell_vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform = "true"
    Environment = "dev"
    }
  }

resource "aws_security_group" "alb" {
  name   = "sg_alb"
  vpc_id = module.vpc.vpc_id

  ingress {
   protocol         = "tcp"
   from_port        = 80
   to_port          = 80
   cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
   protocol         = "tcp"
   from_port        = 443
   to_port          = 443
   cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
   protocol         = "tcp"
   from_port        = 22
   to_port          = 22
   cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
   protocol         = "-1"
   from_port        = 0
   to_port          = 0
   cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
      Name = "sg_alb"
    }
}

resource "aws_security_group" "service_security_group" {
  name = "sg_service"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
      Name = "sg_service"
    }
}

output "femwell_url" {
  value = aws_alb.femwell_load_balancer.dns_name
}


# output "aurora_endpoint" {
#   value = aws_rds_cluster.aurora_cluster.endpoint
# }