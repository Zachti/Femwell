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

resource "aws_ecs_task_definition" "femwell_task" {
  family                   = "femwell-task"
  container_definitions    = jsonencode(
  [
    {
      name: "femwell-task-wolverine",
      image: aws_ecr_repository.wolverine_ecr_repo.repository_url,
      essential: true,
      portMappings: [
        {
          "containerPort": 3001,
          "hostPort": 3001
        }
      ],
      memory: 512,
      cpu: 256
    },
    {
      name: "femwell-task-vault",
      image: aws_ecr_repository.vault_ecr_repo.repository_url,
      essential: true,
      portMappings: [
        {
          "containerPort": 3002,
          "hostPort": 3002
        }
      ],
      memory: 512,
      cpu: 256
    },
    {
      name: "femwell-task-heimdall",
      image: aws_ecr_repository.heimdall_ecr_repo.repository_url,
      essential: true,
      portMappings: [
        {
          "containerPort": 3003,
          "hostPort": 3003
        }
      ],
      memory: 512,
      cpu: 256
    },
    {
      name: "femwell-task-denden",
      image: aws_ecr_repository.denden_ecr_repo.repository_url,
      essential: true,
      portMappings: [
        {
          "containerPort": 3004,
          "hostPort": 3004
        }
      ],
      memory: 512,
      cpu: 256
    }
  ])
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 2048         # Specify the memory the container requires
  cpu                      = 1024         # Specify the CPU the container requires
  execution_role_arn       = data.aws_iam_role.existing.arn
}

resource "aws_alb" "femwell_load_balancer" {
  name               = "load-balancer-dev"
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

data "aws_key_pair" "existing_key_pair" {
   key_name = "my-key-pair"
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

resource "aws_ecs_service" "femwell_service" {
  name            = "femwell"     # Name the service
  cluster         = aws_ecs_cluster.femwell.id   # Reference the created Cluster
  task_definition = aws_ecs_task_definition.femwell_task.arn # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = module.vpc.public_subnets 
    assign_public_ip = true     # Provide the containers with public IPs
    security_groups  = [aws_security_group.alb.id] # Set up the security group
  }
}

output "femwell_url" {
  value = aws_alb.femwell_load_balancer.dns_name
}