import { type Request, type Response, type NextFunction } from 'express';
import ShopService from '../services/shop.service';
import { Ok } from '../utils/response/success.response';

class ShopController {
    async getShop(req: Request, res: Response, next: NextFunction) {
        try {
            const filterData = req.query;
            const shop = await ShopService.findOne(filterData);

            return new Ok('Get specific shop successfully', shop).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new ShopController();
