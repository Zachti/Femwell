variable container_port {
  type        = list(number)
  default     = []
}

variable "region" {
  default = "us-east-1"
  type = string
}

//all containers
variable "LOG_LEVEL" {
  description = "Log level for the application"
  type        = string
  default     = "debug"
}

variable "NODE_ENV" {
  description = "Node environment for the application"
  type        = string
  default     = "development"
}

variable "STREAM_ARN" {
  description = "ARN of the Kinesis stream"
  type        = string
}

variable "COGNITO_USER_POOL_ID" {
  description = "ID of the Cognito user pool"
  type        = string
}

variable "COGNITO_CLIENT_ID" {
  description = "ID of the Cognito client"
  type        = string
}

//denden container
variable "DENDEN_PORT" {}
variable "AWS_CLOUD_FRONT_ENDPOINT" {}
variable "AWS_CLOUD_FRONT_DISTRIBUTION_ID" {}

//heimdall container
variable "HEIMDALL_PORT" {}
variable "AWS_BUCKET" {}
variable "BUCKET_LOCATION_BASE_FOLDER" {}
variable "MAX_FILE_SIZE" {}
variable "AWS_S3_ENDPOINT" {}
variable "S3_CHECKLIST_KEY" {}
variable "SUPPORT_EMAIL" {}

//vault container
variable "VAULT_PORT" {}
variable "WOLVERINE_ENDPOINT" {}

//wolverine container
variable "WOLVERINE_PORT" {}
variable "AWS_AURORA_URL" {}
