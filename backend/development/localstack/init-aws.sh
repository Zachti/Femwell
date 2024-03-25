#_________________________________________________________________
# This script called automatically after localstack initialization
#_________________________________________________________________

# verify the email address so ses will send mails
awslocal ses verify-email-identity --email-address no-reply-dev@femwell.com

# create the templated needed to send mails
awslocal ses create-template --template TemplateName="Invite",SubjectPart="foo",TextPart="foo",HtmlPart=""
awslocal ses create-template --template TemplateName="ForgotPassword",SubjectPart="reset",TextPart="reset",HtmlPart=""

awslocal kinesis create-stream --stream-name localDevStream --shard-count  1
awslocal kinesis describe-stream --stream-name localDevStream
echo '******************************'
echo '    kinesis stream created    '
echo '******************************'

# create S3 bucket for local pipeline service
awslocal s3api create-bucket --bucket demo-data --create-bucket-configuration LocationConstraint=eu-central-1 --region us-east-1
awslocal s3api create-bucket --bucket local-dev --create-bucket-configuration LocationConstraint=eu-central-1 --region us-east-1
echo '******************************'
echo '    buckets created    '
echo '******************************'

aws --endpoint-url=http://localhost:4566 s3 cp /var/lib/localstack/local-dev/ s3://demo-data/ --recursive

