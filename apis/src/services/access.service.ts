import Shop, { ShopDocument } from '../models/shop.model';
import { ShopInput } from '../schema/shop.schema';

class AccessService {
    static async createShop(shopData: ShopInput['body']): Promise<ShopDocument> {
        try {
            const isExits = await Shop.findOne({ email: shopData.email });
            if (isExits) throw new Error('shop already exists');

            const newShop: ShopDocument = new Shop(shopData);
            await newShop.save();

            return newShop.toObject();
        } catch (error) {
            throw error;
        }
    }
}

export default AccessService;
