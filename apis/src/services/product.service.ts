import Product from "../models/product/product.model";
import { ProductDocument } from "../models/product/product.schema";
import { ProductInput } from "../schema/product.schema";
import { PaginationQueryString } from "../shared/types";
import Pagination from "../utils/pagination";

class ProductService {
    static async createProduct(productData: ProductInput["body"]): Promise<ProductDocument> {
        try {
            const product: ProductDocument = await Product.create(productData);
            return product.toObject();
        } catch (error) {
            throw error;
        }
    }

    static async getProducts(queryString: PaginationQueryString): Promise<ProductDocument[]> {
        try {
            const products: ProductDocument[] = await new Pagination<ProductDocument>(
                Product.find({ isPublish: true }),
                queryString
            ).paginate();
            return products;
        } catch (error) {
            throw error;
        }
    }

    static async getProductById(productId: string): Promise<ProductDocument | null> {
        try {
            const product: ProductDocument | null = await Product.findById(productId);

            return product ? product.toObject() : null;
        } catch (error) {
            throw error;
        }
    }

    static async getPublishedProductsByShop(
        shopId: string,
        queryString: PaginationQueryString
    ): Promise<ProductDocument[]> {
        try {
            const products: ProductDocument[] = await new Pagination<ProductDocument>(
                Product.find({ shop: shopId, isPublish: true }),
                queryString
            ).paginate();
            return products;
        } catch (error) {
            throw error;
        }
    }

    static async getUnpublishedProductsByShop(
        shopId: string,
        queryString: PaginationQueryString
    ): Promise<ProductDocument[]> {
        try {
            const products: ProductDocument[] = await new Pagination<ProductDocument>(
                Product.find({ shop: shopId, isPublish: false }),
                queryString
            ).paginate();
            return products;
        } catch (error) {
            throw error;
        }
    }

    static async publishProductById(productId: string): Promise<ProductDocument | null> {
        try {
            const publishedProduct = await Product.findByIdAndUpdate(
                productId,
                { isPublish: true },
                {
                    new: true,
                }
            );

            return publishedProduct ? publishedProduct.toObject() : null;
        } catch (error) {
            throw error;
        }
    }

    static async unpublishProductById(productId: string): Promise<ProductDocument | null> {
        try {
            const unpublishedProduct: ProductDocument | null = await Product.findByIdAndUpdate(
                productId,
                { isPublish: false },
                {
                    new: true,
                }
            );

            return unpublishedProduct ? unpublishedProduct.toObject() : null;
        } catch (error) {
            throw error;
        }
    }

    static async searchProducts(keyword: string, queryString: PaginationQueryString): Promise<ProductDocument[]> {
        try {
            const products: ProductDocument[] = await new Pagination(
                Product.find({ $text: { $search: keyword } }),
                queryString
            ).paginate();

            return products;
        } catch (error) {
            throw error;
        }
    }
}

export default ProductService;
