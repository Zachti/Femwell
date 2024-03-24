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

resource "aws_ecs_task_definition" "femwell_task" {
  family                   = "femwell-task"
  container_definitions    = jsonencode(
  [
    {
      name: "femwell-task",
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
      name: "femwell-task",
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
    },
    {
      name: "femwell-task",
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
      name: "femwell-task",
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
    }
  ])
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "us-east-1a"
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "us-east-1b"
}

resource "aws_alb" "femwell_load_balancer" {
  name               = "load-balancer-dev"
  load_balancer_type = "application"
  subnets = [
    aws_default_subnet.default_subnet_a.id,
    aws_default_subnet.default_subnet_b.id
  ]
  security_groups = [aws_security_group.alb.id]
}

resource "aws_lb_target_group" "target_group" {
  name        = "target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_alb.femwell_load_balancer.arn #  load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn # target group
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

  ingress {
   protocol         = "tcp"
   from_port        = 3001
   to_port          = 3001
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
}

resource "aws_ecs_service" "femwell_service" {
  name            = "femwell"     # Name the service
  cluster         = aws_ecs_cluster.femwell.id   # Reference the created Cluster
  task_definition = aws_ecs_task_definition.femwell_task.arn # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 5 # Set up the number of containers to 5

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn # Reference the target group
    container_name   = aws_ecs_task_definition.femwell_task.family
    container_port   = 5000 # Specify the container port
  }

  network_configuration {
    subnets          = [aws_default_subnet.default_subnet_a.id, aws_default_subnet.default_subnet_b.id]
    assign_public_ip = true     # Provide the containers with public IPs
    security_groups  = [aws_security_group.alb.id] # Set up the security group
  }
}

output "femwell_url" {
  value = aws_alb.femwell_load_balancer.dns_name
}

#resource "aws_instance" "my_ec2_instance" {
#  ami           = "ami-0a3c3a20c09d6f377" #AZN LINUX
#  instance_type = "t2.micro"
#  key_name      = data.aws_key_pair.existing_key_pair.key_name
#  associate_public_ip_address = true
#  subnet_id = module.vpc.public_subnets[0]
#  security_groups = [aws_security_group.alb.id]
#
#  user_data = <<-EOF
#              #!/bin/bash
#              sudo yum update -y
#              sudo yum install -y git
#              sudo mkdir /home/ec2-user/Femwell
#              sudo git clone https://github.com/BeBo1337/Femwell.git /home/ec2-user/Femwell
#              sudo yum install -y docker
#              sudo service docker start
#              sudo usermod -a -G docker ec2-user
#              sudo yum install curl -y
#              sudo dnf install libxcrypt-compat -y
#              sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
#              sudo chmod +x /usr/local/bin/docker-compose
#              sudo cd /home/ec2-user/Femwell/backend
#              sudo docker-compose up wolverine
#              EOF
#
#  tags = {
#    Name = "Imagine?"
#  }
#}
