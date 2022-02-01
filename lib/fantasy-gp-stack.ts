import * as cdk from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as cognito from '@aws-cdk/aws-cognito';
import {AttributeType} from '@aws-cdk/aws-dynamodb';
import {LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {Duration} from "@aws-cdk/core";
import {Effect, PolicyStatement} from "@aws-cdk/aws-iam";

export class FantasyGpStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let environment: {[k: string]: any} = {};

    const userpool = new cognito.UserPool(this, 'myuserpool', {
      userPoolName: 'myawesomeapp-userpool',
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
        tempPasswordValidity: Duration.days(7),
      },
      autoVerify: { email: true }
    });

    const cognitoClient = userpool.addClient('GrandPrixClient', {
      authFlows: {
        userPassword: true
      }
    })
    environment.COGNITO_CLIENT_ID = cognitoClient.userPoolClientId;

    const gpTable = new dynamo.Table(this, 'GrandPrixTable', {
      tableName: 'GrandPrix',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING
      }
    });
    environment.TABLE_NAME = gpTable.tableName;

    const createGpHandler = new lambda.NodejsFunction(this, 'CreateGPHandler', {
      entry: './src/create-gp-handler.ts',
      functionName: 'create-gp-handler',
      environment
    });
    gpTable.grantReadWriteData(createGpHandler);
    createGpHandler.addToRolePolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'cognito-idp:SignUp',
          ],
          resources: [
              userpool.userPoolArn
          ],
        })
    );

    const api = new apigw.RestApi(this, 'fantasy-gp');
    const gp = api.root.addResource('gp');
    gp.addMethod('POST', new LambdaIntegration(createGpHandler));
  }
}
