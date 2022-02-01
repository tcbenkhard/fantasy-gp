import {CreateGPRequest} from "../create-gp-handler";
import {CognitoRepository} from "../repository/cognito-repository";
import {GrandPrixRepository} from "../repository/gp-repository";
import {Player} from "../model/player";
import {GrandPrix} from "../model/grand-prix";
import {v4 as uuid} from 'uuid';
import * as AWS from 'aws-sdk';
import {ApiError} from "../util/error";

export class GrandPrixService {
    private cognito = new CognitoRepository();
    private gp = new GrandPrixRepository();

    public createGP = async (request: CreateGPRequest): Promise<GrandPrix> => {
        const tournamentId = uuid();
        const playerId = uuid();
        const player: Player = {
            id: tournamentId,
            sk: `player#${playerId}`,
            email: request.email,
            name: request.playerName,
            score: 0
        }
        try {
            await this.cognito.createUser(player, request.password);
        } catch (e) {
            // @ts-ignore
            if(e.name === 'UsernameExistsException') {
                throw ApiError.badRequest('USERNAME_EXISTS', `Username ${request.email} already exists.`)
            }
            throw e;
        }

        const tournament = await this.gp.saveGP({
            id: tournamentId,
            sk: 'meta',
            name: request.gpName,
            adminUsername: player.email
        });

        await this.gp.savePlayer(player);

        return tournament;
    }
}