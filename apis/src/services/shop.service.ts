import { omit } from 'lodash';
import { FilterQuery } from 'mongoose';
import Shop, { ShopDocument } from '../models/shop.model';
import { NotFoundError } from '../utils/response/error.response';

class ShopService {
    static async find(filter: FilterQuery<Object>): Promise<ShopDocument[] | []> {
        try {
            const shop = await Shop.find(filter).select('-password');
            return shop;
        } catch (error: any) {
            throw error;
        }
    }

    static async findOne(filter: FilterQuery<Object>): Promise<Omit<ShopDocument, 'password'> | null> {
        try {
            const shop = await Shop.findOne(filter).select('-password');
            return shop ? omit(shop.toObject(), 'password') : shop;
        } catch (error: any) {
            throw error;
        }
    }

    static async validatePassword(userId: string, password: string): Promise<Boolean> {
        try {
            const shop = await Shop.findById(userId);
            if (!shop) throw new NotFoundError('Shop does not exist');

            return shop.comparePassword(password);
        } catch (error: any) {
            throw error;
        }
    }
}

export default ShopService;
