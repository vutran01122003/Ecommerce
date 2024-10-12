import express, { type Router } from "express";
import productController from "../../controllers/product.controller";
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

router.post("/products", auth, validateInput(productSchema), productController.createProduct);

router.get("/products", validateInput(paginationSchema), productController.getProducts);
router.get("/products/search", validateInput(productSearchSchema), productController.searchProducts);
router.get("/products/:productId", validateInput(productIdSchema), productController.getProductById);

router.patch(
    "/products/:productId/publish",
    auth,
    validateInput(productIdSchema),
    productController.publishProductById
);
router.patch(
    "/products/:productId/unpublish",
    auth,
    validateInput(productIdSchema),
    productController.unpublishProductById
);

router.get(
    "/published-products/:shopId",
    auth,
    validateInput(paginationSchema),
    validateInput(shopIdSchema),
    productController.getPublishedProductsByShop
);
router.get(
    "/unpublished-products/:shopId",
    auth,
    validateInput(paginationSchema),
    validateInput(shopIdSchema),
    productController.getUnpublishedProductsByShop
);

router.put(
    "/products/:productId",
    auth,
    validateInput(productIdSchema),
    validateInput(productSchema),
    productController.updateProductById
);

router.delete("/products/:productId", auth, validateInput(productIdSchema), productController.deleteProductById);

export default router;
