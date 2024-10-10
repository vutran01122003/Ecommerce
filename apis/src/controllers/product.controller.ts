import { type Request, type Response, type NextFunction } from "express";
import ProductService from "../services/product.service";
import {
    PaginationInput,
    ProductIdInput,
    ProductInput,
    ProductSearchInput,
    ShopIdInput,
} from "../schema/product.schema";
import { Created, Ok, Updated } from "../utils/response/success.response";
import { ProductDocument } from "../models/product/product.schema";

class ProductController {
    async createProduct(req: Request<{}, {}, ProductInput["body"]>, res: Response, next: NextFunction) {
        try {
            const productData: ProductInput["body"] = req.body;
            const product: ProductDocument = await ProductService.createProduct(productData);

            return new Created("Create product successfully", product).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req: Request<{}, {}, {}, PaginationInput["query"]>, res: Response, next: NextFunction) {
        try {
            const { page, limit } = req.query;
            const products: ProductDocument[] = await ProductService.getProducts({
                page: +page!,
                limit: +limit!,
            });

            return new Ok("Get products successfully", products).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: Request<ProductIdInput["params"]>, res: Response, next: NextFunction) {
        try {
            const productId: string = req.params.productId;
            const product: ProductDocument | null = await ProductService.getProductById(productId);

            return product;
        } catch (error) {
            next(error);
        }
    }

    async getPublishedProductsByShop(req: Request<ShopIdInput["params"]>, res: Response, next: NextFunction) {
        try {
            const shopId: string = req.params.shopId;
            const { page, limit } = req.query;

            const products: ProductDocument[] = await ProductService.getPublishedProductsByShop(shopId, {
                page: +page!,
                limit: +limit!,
            });

            return new Ok("Get published products successfully", products).send(res);
        } catch (error) {
            next(error);
        }
    }

    async getUnpublishedProductsByShop(
        req: Request<ShopIdInput["params"], {}, {}, PaginationInput["query"]>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const shopId: string = req.params.shopId;
            const { page, limit } = req.query;

            const products: ProductDocument[] = await ProductService.getUnpublishedProductsByShop(shopId, {
                page: +page!,
                limit: +limit!,
            });

            return new Ok("Get published products successfully", products).send(res);
        } catch (error) {
            next(error);
        }
    }

    async publishProductById(req: Request<ProductIdInput["params"]>, res: Response, next: NextFunction) {
        try {
            const productId: string = req.params.productId;
            const publishedProduct = await ProductService.publishProductById(productId);

            return new Updated("Publish product successfully", publishedProduct).send(res);
        } catch (error) {
            next(error);
        }
    }

    async unpublishProductById(req: Request<ProductIdInput["params"]>, res: Response, next: NextFunction) {
        try {
            const productId: string = req.params.productId;

            const unpublishedProduct = await ProductService.unpublishProductById(productId);

            return new Updated("Unpublish product successfully", unpublishedProduct).send(res);
        } catch (error) {
            next(error);
        }
    }

    async searchProducts(req: Request<{}, {}, {}, ProductSearchInput["query"]>, res: Response, next: NextFunction) {
        try {
            const { limit, page, keyword } = req.query;

            const products: ProductDocument[] = await ProductService.searchProducts(keyword, {
                limit: +limit,
                page: +page,
            });

            return new Ok("Search products successfully", products).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
