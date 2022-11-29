import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import { formatJSONResponse } from "@libs/api-gateway";

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const token = event.authorizationToken;
  console.log('authorizationToken: ', token);

  if (event.type !== 'TOKEN' || !token) {
    console.log("Unauthorized");
    return formatJSONResponse(401, "Failed to authenticate");
  }

  try {
    const encodedCreds = token.split(' ')[1];
    const tmp = Buffer.from(encodedCreds, 'base64');
    const plainCreds = tmp.toString('utf-8').split(':');

    const username = plainCreds[0];
    const password = plainCreds[1];
    console.log(`TOKEN=${username}:${password}`);

    const storedUserPassword = process.env.PASSWORD;
    console.log(`storedUserPassword ${process.env.LOGIN}:${process.env.PASSWORD}`);

    const effect =
      !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';
    console.log('effect: ', effect);

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    console.log('policy: ', policy);

    return policy;
  } catch (e) {
    console.log(`Unauthorized: ${e.message}`);
    return formatJSONResponse(403, "Access is denied");
  }
}

const generatePolicy = (principalId, resource, effect='Allow') => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }
      ]
    }
  };
}

export const main = middyfy(basicAuthorizer);

