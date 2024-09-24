import { ShopDocument } from '../models/shop.model';

export interface VerifyTokenResponse {
    error: any;
    isExpired: boolean;
    userData: ShopDocument | null;
}
