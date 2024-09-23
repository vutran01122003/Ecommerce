import JWT, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import fs from 'fs';
import ShopService from './shop.service';
import { omit, reject } from 'lodash';
import _default from '../../config/default';
import { ShopDocument } from '../models/shop.model';
import { ErrorResponse } from '../expection/errorResponse';
import { VerifyTokenResponse } from '../schema/verifyTokenResponse.schema';
import { ReIssueTokenResponse } from '../schema/reissueTokenResponse.schema';
import client from '../database/redis';
import { RedisKey } from 'ioredis';

class JWTService {
    static async signToken(
        payload: Object,
        options: JWT.SignOptions,
        keyName: 'ACCESS_KEY' | 'REFRESH_KEY'
    ): Promise<string> {
        try {
            const keyValue = fs.readFileSync(`${__dirname}/../../keys/${keyName.toLocaleLowerCase()}/privateKey.pem`, {
                encoding: 'utf-8'
            });
            const token = await JWT.sign(payload, keyValue, {
                ...(options && options),
                algorithm: 'RS256'
            });
            return token;
        } catch (error) {
            throw error;
        }
    }

    static async verifyToken(tokenValue: string, keyName: 'ACCESS_KEY' | 'REFRESH_KEY'): Promise<VerifyTokenResponse> {
        return new Promise((resolve, reject) => {
            try {
                const keyValue = fs.readFileSync(
                    `${__dirname}/../../keys/${keyName.toLocaleLowerCase()}/publicKey.crt`,
                    {
                        encoding: 'utf-8'
                    }
                );

                JWT.verify(tokenValue, keyValue, (error, data) => {
                    if (error) {
                        resolve({
                            error,
                            isExpired: error instanceof TokenExpiredError,
                            userData: null
                        });
                    }

                    resolve({
                        error: null,
                        isExpired: error instanceof TokenExpiredError,
                        userData: data as ShopDocument
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static async reIssueAccessToken(refreshToken: string): Promise<ReIssueTokenResponse> {
        try {
            const { userData, error, isExpired }: VerifyTokenResponse = await this.verifyToken(
                refreshToken,
                'REFRESH_KEY'
            );

            if (isExpired) throw new ErrorResponse(403, 'Forbidden');
            if (error) throw error;

            const validRefreshToken = await client.get(userData!._id as RedisKey);

            if (validRefreshToken !== refreshToken) {
                throw new ErrorResponse(400, 'Invalid Authorization');
            }

            const user: Omit<ShopDocument, 'password'> | null = await ShopService.findOne({ _id: userData!._id });

            if (!user) throw new ErrorResponse(404, 'Shop is not exist');

            const accessToken: string = await this.signToken(
                user,
                { expiresIn: _default.ACCESS_TOKEN_TTL },
                'ACCESS_KEY'
            );

            return { accessToken, userData: user };
        } catch (error) {
            throw error;
        }
    }
}

export default JWTService;
