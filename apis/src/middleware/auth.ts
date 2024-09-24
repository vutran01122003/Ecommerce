import { type Request, type Response, type NextFunction } from 'express';
import _default from '../../config/default';
import JWTService from '../services/jwt.service';
import { VerifyTokenResponse } from '../types/verify.token.type';
import { ReIssueTokenResponse } from '../types/reissue.token.type';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization as string;
        const { userData, error, isExpired }: VerifyTokenResponse = await JWTService.verifyToken(
            accessToken,
            'ACCESS_KEY'
        );

        if (userData) res.locals.userData = userData;
        if (isExpired) {
            const refreshToken = req.headers['x-refresh'] as string;
            const { accessToken, userData }: ReIssueTokenResponse = await JWTService.reIssueAccessToken(refreshToken);
            res.locals.userData = userData;
            res.setHeader('x-access-token', accessToken);
        }
        if (error && !isExpired) throw error;

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export default auth;
