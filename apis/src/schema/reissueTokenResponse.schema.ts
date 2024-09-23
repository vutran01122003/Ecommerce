import { ShopDocument } from '../models/shop.model';

export interface ReIssueTokenResponse {
    accessToken: string;
    userData: Omit<ShopDocument, 'password'>;
}
