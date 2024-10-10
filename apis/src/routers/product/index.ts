import express, { type Router } from "express";
import ProductController from "../../controllers/product.controller";
import auth from "../../middleware/auth";
import validateInput from "../../middleware/validateResource";
import {
    paginationSchema,
    productIdSchema,
    productSchema,
    productSearchSchema,
    shopIdSchema,
} from "../../schema/product.schema";

const router: Router = express.Router();

router.post("/products", auth, validateInput(productSchema), ProductController.createProduct);

router.get("/products", validateInput(paginationSchema), ProductController.getProducts);
router.get("/products/search", validateInput(productSearchSchema), ProductController.searchProducts);
router.get("/products/:productId", validateInput(productIdSchema), ProductController.getProductById);

router.patch(
    "/products/:productId/publish",
    auth,
    validateInput(productIdSchema),
    ProductController.publishProductById
);
router.patch(
    "/products/:productId/unpublish",
    auth,
    validateInput(productIdSchema),
    ProductController.unpublishProductById
);

router.get(
    "/published-products/:shopId",
    auth,
    validateInput(paginationSchema),
    validateInput(shopIdSchema),
    ProductController.getPublishedProductsByShop
);
router.get(
    "/unpublished-products/:shopId",
    auth,
    validateInput(paginationSchema),
    validateInput(shopIdSchema),
    ProductController.getUnpublishedProductsByShop
);

export default router;
