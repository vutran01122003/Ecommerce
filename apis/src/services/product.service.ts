import Pagination from "../utils/pagination";
import Product from "../models/product/product.model";
import { ProductDocument } from "../models/product/product.schema";
import { ProductInput } from "../schema/product.schema";
import { PaginationQueryString } from "../shared/types";
import { NotFoundError } from "../utils/response/error.response";

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

    static async getProductById(productId: string): Promise<ProductDocument> {
        try {
            const product: ProductDocument | null = await Product.findById(productId);

            if (!product) throw new NotFoundError("Product does not exist");

            return product.toObject();
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

    static async publishProductById(userId: string, productId: string): Promise<ProductDocument> {
        try {
            const publishedProduct = await Product.findOneAndUpdate(
                {
                    shop: userId,
                    _id: productId,
                },
                { isPublish: true },
                {
                    new: true,
                }
            );

            if (!publishedProduct) throw new NotFoundError("Product does not exist");

            return publishedProduct.toObject();
        } catch (error) {
            throw error;
        }
    }

    static async unpublishProductById(userId: string, productId: string): Promise<ProductDocument> {
        try {
            const unpublishedProduct: ProductDocument | null = await Product.findOneAndUpdate(
                {
                    _id: productId,
                    shop: userId,
                },
                { isPublish: false },
                {
                    new: true,
                }
            );

            if (!unpublishedProduct) throw new NotFoundError("Product does not exist");

            return unpublishedProduct.toObject();
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

    static async updateProduct(
        userId: string,
        productId: string,
        changedProduct: ProductInput["body"]
    ): Promise<ProductDocument | null> {
        try {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: productId,
                    shop: userId,
                },
                changedProduct,
                {
                    new: true,
                }
            );

            if (!updatedProduct) throw new NotFoundError("Product does not exist");

            return updatedProduct.toObject();
        } catch (error) {
            throw error;
        }
    }

    static async deleteProductById(userId: string, productId: string): Promise<void> {
        try {
            console.log({
                userId,
                productId,
            });
            const result = await Product.findOneAndDelete({ _id: productId, shop: userId });
            if (!result) throw new NotFoundError("Product does not exist");
        } catch (error) {
            throw error;
        }
    }
}

export default ProductService;
