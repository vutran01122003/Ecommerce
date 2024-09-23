import { type Request, type Response, type NextFunction } from 'express';
import _default from '../../config/default';
import JWTService from '../services/jwt.service';
import { VerifyTokenData } from '../schema/verifyTokenResponse.schema';
import { ReIssueTokenData } from '../schema/reissueTokenResponse.schema';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization as string;
        const { userData, error, isExpired }: VerifyTokenData = await JWTService.verifyToken(accessToken, 'ACCESS_KEY');

        if (userData) res.locals.userData = userData;
        if (isExpired) {
            const refreshToken = req.headers['x-refresh'] as string;
            const { accessToken, userData }: ReIssueTokenData = await JWTService.reIssueAccessToken(refreshToken);
            res.locals.userData = userData;
            res.setHeader('x-access-token', accessToken);
        }
        if (error && !isExpired) throw error;
        console.log(userData);
        next();
    } catch (error) {
        next(error);
    }
};

export default auth;
