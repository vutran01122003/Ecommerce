import { type Request, type Response, type NextFunction } from "express";
import ProductService from "../services/product.service";
import {
    PaginationInput,
    ProductIdInput,
    ProductInput,
    ProductSearchInput,
    ShopIdInput,
} from "../schema/product.schema";
import { Created, Deleted, Ok, Updated } from "../utils/response/success.response";
import { ProductDocument } from "../models/product/product.schema";
import { BadRequestError } from "../utils/response/error.response";

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
            const product: ProductDocument = await ProductService.getProductById(productId);

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
            const userId: string = res.locals.userData._id;

            if (shopId !== userId.toString()) throw new BadRequestError("You are not the shop owner");

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
            const userId: string = res.locals.userData._id;

            const publishedProduct: ProductDocument = await ProductService.publishProductById(userId, productId);

            return new Updated("Publish product successfully", publishedProduct).send(res);
        } catch (error) {
            next(error);
        }
    }

    async unpublishProductById(req: Request<ProductIdInput["params"]>, res: Response, next: NextFunction) {
        try {
            const productId: string = req.params.productId;
            const userId: string = res.locals.userData._id;

            const unpublishedProduct: ProductDocument = await ProductService.unpublishProductById(userId, productId);

            return new Updated("Unpublish product successfully", unpublishedProduct).send(res);
        } catch (error) {
            next(error);
        }
    }

    async searchProducts(req: Request<{}, {}, {}, ProductSearchInput["query"]>, res: Response, next: NextFunction) {
        try {
            const { limit, page, keyword }: { limit: string; page: string; keyword: string } = req.query;

            const products: ProductDocument[] = await ProductService.searchProducts(keyword, {
                limit: +limit,
                page: +page,
            });

            return new Ok("Search products successfully", products).send(res);
        } catch (error) {
            next(error);
        }
    }

    async updateProductById(
        req: Request<ProductIdInput["params"], {}, ProductInput["body"]>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const productId: string = req.params.productId;
            const productData: ProductInput["body"] = req.body;
            const { _id: userId } = res.locals.userData;

            const updatedProduct = await ProductService.updateProduct(userId, productId, productData);

            return new Updated("Update product successfully", updatedProduct).send(res);
        } catch (error) {
            next(error);
        }
    }

    async deleteProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = res.locals.userData._id;
            const productId: string = req.params.productId;

            await ProductService.deleteProductById(userId, productId);

            return new Deleted("Delete product successfully").send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
