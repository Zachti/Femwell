#!/bin/bash

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

#create Cognito user pool
#export COGNITO_USER_POOL_ID=$(awslocal cognito-idp create-user-pool --pool-name myUserPool | jq -rc ".UserPool.Id")
#create Cognito client id
#export COGNITO_CLIENT_ID=$(awslocal cognito-idp create-user-pool-client --user-pool-id COGNITO_USER_POOL_ID --client-name myClient | jq -rc ".UserPoolClient.ClientId")

#echo "COGNITO_CLIENT_ID: $COGNITO_CLIENT_ID"
#echo "COGNITO_USER_POOL_ID: $COGNITO_USER_POOL_ID"

aws --endpoint-url=http://localhost:4566 s3 cp /var/lib/localstack/local-dev/ s3://demo-data/ --recursive
