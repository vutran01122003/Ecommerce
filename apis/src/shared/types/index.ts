import { ShopDocument } from "../../models/shop.model";

export interface ReIssueTokenResponse {
    accessToken: string;
    userData: Omit<ShopDocument, "password">;
}

export interface VerifyTokenResponse {
    error: any;
    isExpired: boolean;
    userData: ShopDocument | null;
}

export interface PaginationQueryString {
    limit: number;
    page: number;
}
