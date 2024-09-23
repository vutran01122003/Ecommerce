import { type Request, type Response, type NextFunction } from 'express';

import { omit } from 'lodash';
import { type LoginInput } from '../schema/login.schema';
import { type ShopInput } from '../schema/shop.schema';
import { ErrorResponse } from '../expection/errorResponse';

import AccessService from '../services/access.service';
import _default from '../../config/default';
import ShopService from '../services/shop.service';
import { ShopDocument } from '../models/shop.model';
import JWTService from '../services/jwt.service';
import client from '../database/redis';
import { RedisKey } from 'ioredis';

const { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } = _default;

class AccessController {
    public async registerAccount(req: Request<{}, {}, ShopInput['body']>, res: Response, next: NextFunction) {
        try {
            const userData = req.body;
            const newShop: ShopDocument = await AccessService.createShop(userData);

            const [accessToken, refreshToken] = await Promise.all([
                JWTService.signToken(newShop, { expiresIn: ACCESS_TOKEN_TTL }, 'ACCESS_KEY'),
                JWTService.signToken(newShop, { expiresIn: REFRESH_TOKEN_TTL }, 'REFRESH_KEY')
            ]);

            res.status(201).json({
                code: '001',
                message: 'Create new user successfully',
                metadata: {
                    ...omit(newShop, 'password'),
                    tokens: {
                        accessToken,
                        refreshToken
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    public async loginAccount(req: Request<{}, {}, LoginInput['body']>, res: Response, next: NextFunction) {
        try {
            const loginData: LoginInput['body'] = req.body;

            const shop = await ShopService.findOne({ email: loginData.email });
            if (!shop) throw new ErrorResponse(401, 'Unauthorized');
            const userId = shop._id as unknown as string;

            if (!ShopService.validatePassword(userId, loginData.password)) throw new ErrorResponse(401, 'Unauthorized');

            const [accessToken, refreshToken] = await Promise.all([
                JWTService.signToken(shop, { expiresIn: ACCESS_TOKEN_TTL }, 'ACCESS_KEY'),
                JWTService.signToken(shop, { expiresIn: REFRESH_TOKEN_TTL }, 'REFRESH_KEY')
            ]);

            await client.set(userId, refreshToken, 'EX', Number.parseInt(REFRESH_TOKEN_TTL) * 24 * 60 * 60);

            return res.status(200).json({
                message: 'Login successfully',
                metadata: {
                    ...omit(shop, 'password'),
                    tokens: {
                        accessToken,
                        refreshToken
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    public async logoutAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = res.locals.userData;
            await client.del(userData!._id as RedisKey);

            res.status(200).json({
                message: 'Logout successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AccessController();
