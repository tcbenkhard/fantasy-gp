import * as AWS from 'aws-sdk';
import {Player} from "../model/player";
import {getEnv} from "../util/env";

export class CognitoRepository {
    private cognito = new AWS.CognitoIdentityServiceProvider();
    private readonly COGNITO_CLIENT_ID = getEnv('COGNITO_CLIENT_ID');

    createUser = async (player: Player, password: string) => {
        const user = await this.cognito.signUp({
            ClientId: this.COGNITO_CLIENT_ID,
            Username: player.email,
            Password: password,
        }).promise();
    }
}
