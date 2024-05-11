#!/bin/bash

# Tagging Docker images
docker tag backend-vault:latest 805878780751.dkr.ecr.us-east-1.amazonaws.com/vault:latest
docker tag backend-heimdall:latest 805878780751.dkr.ecr.us-east-1.amazonaws.com/heimdall:latest
docker tag backend-denden:latest 805878780751.dkr.ecr.us-east-1.amazonaws.com/denden:latest
docker tag backend-wolverine:latest 805878780751.dkr.ecr.us-east-1.amazonaws.com/wolverine:latest

# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 805878780751.dkr.ecr.us-east-1.amazonaws.com

# Push Docker images to AWS ECR
docker push 805878780751.dkr.ecr.us-east-1.amazonaws.com/heimdall:latest
docker push 805878780751.dkr.ecr.us-east-1.amazonaws.com/denden:latest
docker push 805878780751.dkr.ecr.us-east-1.amazonaws.com/wolverine:latest
docker push 805878780751.dkr.ecr.us-east-1.amazonaws.com/vault:latest
