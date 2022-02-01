import * as AWS from 'aws-sdk';
import {Track} from "../model/track";
import {GrandPrix} from "../model/grand-prix";
import {Player} from "../model/player";
import {Time} from "../model/time";
import {getEnv} from "../util/env";

export class GrandPrixRepository {
    private db = new AWS.DynamoDB.DocumentClient();
    private readonly TABLE_NAME = getEnv('TABLE_NAME');

    public saveGP = async (grandPrix: GrandPrix): Promise<GrandPrix> => {
        await this.db.put({
            TableName: this.TABLE_NAME,
            Item: grandPrix,
        }).promise();

        return grandPrix;
    }

    public savePlayer = async (player: Player) => {
        await this.db.put({
            TableName: this.TABLE_NAME,
            Item: player
        }).promise();
    }

    public saveTime = async (time: Time) => {}
    public getAllPlayers = async (tournamentId: string) => {}
    public getAllTimes = async (tournamentId: string, track: Track) => {}
    public getAllTimesForPlayer = async (tournamentId: string, playerId: string) => {}
}