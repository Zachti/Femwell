const { CognitoJwtVerifier } = require('aws-jwt-verify');
const fetch = require('node-fetch');

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
const ecsBaseUrl = process.env.ECS_BASE_URL;

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: 'access',
  clientId,
});

exports.handler = async (event) => {
  const token = event.headers.authorization;

  const path = event.rawPath || event.path;
  const method = event.requestContext.http.method;

  if (!(path === '/vault/graphql')) {
    if (!token)
      return {
        statusCode: 401,
        body: JSON.stringify({message: 'Missing token'}),
      };
    try {
      await verifier.verify(token);
    } catch (err) {
      console.error(err);
      return {
        statusCode: 401,
        body: JSON.stringify({message: 'Invalid access token'}),
      };
    }
  }

  const ecsEndpoint = `${ecsBaseUrl}${path}`;

  const response = await fetch(ecsEndpoint, {
    method: method,
    headers: {
      'authorization': token,
      ...event.headers,
    },
    body: method === 'GET' ? null : JSON.stringify(event.body),
  });

  const responseBody = await response.text();

  return {
    statusCode: response.status,
    body: responseBody,
  };
};
