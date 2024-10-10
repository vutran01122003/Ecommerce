import { type Request, type Response, type NextFunction } from "express";
import { type RedisKey } from "ioredis";
import { omit } from "lodash";
import client from "../database/redis";
import _default from "../../config/default";
import JWTService from "../services/jwt.service";
import ShopService from "../services/shop.service";
import { ShopDocument } from "../models/shop.model";
import { type LoginInput } from "../schema/login.schema";
import { type ShopInput } from "../schema/shop.schema";
import { Created, Ok } from "../utils/response/success.response";
import { UnauthorizedError } from "../utils/response/error.response";
import AccessService from "../services/access.service";

const { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } = _default;

class AccessController {
    public async registerAccount(
        req: Request<{}, {}, ShopInput["body"]>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userData = req.body;
            const newShop: ShopDocument = await AccessService.createShop(userData);

            const [accessToken, refreshToken] = await Promise.all([
                JWTService.signToken(newShop, { expiresIn: ACCESS_TOKEN_TTL }, "ACCESS_KEY"),
                JWTService.signToken(newShop, { expiresIn: REFRESH_TOKEN_TTL }, "REFRESH_KEY"),
            ]);

            await client.set(
                `refreshToken:${newShop._id}`,
                refreshToken,
                "EX",
                Number.parseInt(REFRESH_TOKEN_TTL) * 24 * 60 * 60
            );

            return new Created("Create new user successfully", {
                ...omit(newShop, "password"),
                tokens: {
                    accessToken,
                    refreshToken,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    public async loginAccount(
        req: Request<{}, {}, LoginInput["body"]>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const loginData: LoginInput["body"] = req.body;

            const shop = await ShopService.findOne({ email: loginData.email });
            if (!shop) throw new UnauthorizedError("Email is not exist");
            const userId = shop._id as unknown as string;

            if (!ShopService.validatePassword(userId, loginData.password))
                throw new UnauthorizedError("Incorrect Password");

            const [accessToken, refreshToken] = await Promise.all([
                JWTService.signToken(shop, { expiresIn: ACCESS_TOKEN_TTL }, "ACCESS_KEY"),
                JWTService.signToken(shop, { expiresIn: REFRESH_TOKEN_TTL }, "REFRESH_KEY"),
            ]);

            await client.set(
                `refreshToken:${userId}`,
                refreshToken,
                "EX",
                Number.parseInt(REFRESH_TOKEN_TTL) * 24 * 60 * 60
            );

            return new Ok("Login successfully", {
                ...omit(shop, "password"),
                tokens: {
                    accessToken,
                    refreshToken,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    public async logoutAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = res.locals.userData;
            await client.del(userData!._id as RedisKey);

            return new Ok("Logout successfully").send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new AccessController();
