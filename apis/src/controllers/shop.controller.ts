import { type Request, type Response, type NextFunction } from 'express';
import ShopService from '../services/shop.service';

class ShopController {
    async getShop(req: Request, res: Response, next: NextFunction) {
        try {
            const filterData = req.query;
            const shop = await ShopService.findOne(filterData);

            res.status(200).json({
                message: 'Get shop successfully',
                metadata: shop
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ShopController();
