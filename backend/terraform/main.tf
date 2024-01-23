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

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "my_vpc"
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

resource "aws_instance" "my_ec2_instance" {
  ami           = "ami-0a3c3a20c09d6f377" #AZN LINUX
  instance_type = "t2.micro" 
  key_name      = data.aws_key_pair.existing_key_pair.key_name
  associate_public_ip_address = true
  subnet_id = module.vpc.public_subnets[0]
  security_groups = [aws_security_group.alb.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y git
              sudo mkdir /home/ec2-user/Femwell
              sudo git clone https://github.com/BeBo1337/Femwell.git /home/ec2-user/Femwell
              sudo yum install -y docker
              sudo service docker start
              sudo usermod -a -G docker ec2-user
              sudo yum install curl -y
              sudo dnf install libxcrypt-compat -y
              sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              sudo cd /home/ec2-user/Femwell/backend
              sudo docker-compose up wolverine
              EOF

  tags = {
    Name = "Imagine?"
  }
}
