container_port = [3001, 3002, 3003, 3004]
region = "us-east-1"

//all containers
LOG_LEVEL = "debug"
NODE_ENV = "development"
STREAM_ARN = "arn:aws:kinesis:us-east-1:000000000000:stream/localDevStream"
COGNITO_USER_POOL_ID = "us-east-1_nByIi9v3U"
COGNITO_CLIENT_ID = "74m073jm93p2hti60q6mp7o87j"

//denden container
DENDEN_PORT="3004"
AWS_CLOUD_FRONT_ENDPOINT="https://someFakeValue.cloudfront.net"
AWS_CLOUD_FRONT_DISTRIBUTION_ID="E4CTJUZPLXC0C"

//heimdall container
HEIMDALL_PORT="3003"
AWS_BUCKET="xxxxxxx"
BUCKET_LOCATION_BASE_FOLDER="xxxxxxx"
MAX_FILE_SIZE="1500000"
AWS_S3_ENDPOINT="http://WeHateZachary.co.uk/aws/fkboi"
S3_CHECKLIST_KEY="xxxx"
SUPPORT_EMAIL="support@femwell.ac.il"

//vault container
VAULT_PORT="3002"
WOLVERINE_ENDPOINT="http://leibo.fake.com"

//wolverine container
WOLVERINE_PORT="3001"
AWS_AURORA_URL="mysql://leibo-secure.fake.com"