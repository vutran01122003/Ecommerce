import { string, object, number, boolean, array, discriminatedUnion, literal, TypeOf } from "zod";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
const { LIMIT, PAGE } = process.env;

const clothesSchema = object({
    material: string({ required_error: "Material is required" }),
    size: array(string()).optional(),
    color: array(string()).optional(),
});

const electronicsSchema = object({
    manufacturer: string({ required_error: "Manufacturer is required" }),
    product_model: string({ required_error: "Model is required" }),
    color: array(string()).optional(),
});

const furnitureSchema = object({
    manufacturer: string({ required_error: "Manufacturer is required" }),
    material: string({ required_error: "Material is required" }),
    color: array(string()).optional(),
});

const baseProductSchema = object({
    shop: string({
        required_error: "Shop ID is required",
    }),
    product_name: string({
        required_error: "Product name is required",
    })
        .min(5, "Product name should be at least 5 characters")
        .max(200, "Product name have maximum 200 characters"),
    product_thumb: string().optional(),
    product_images: string().optional(),
    product_type: string({ required_error: "Product type is required" }).max(
        200,
        "Description have maximum 200 characters"
    ),
    product_variation: array(string()).optional(),
    product_quantity: number({ required_error: "Product quantity is required" }).nonnegative(),
    product_quantity_sold: number({
        required_error: "Product quantity sold is required",
    }).nonnegative(),
    product_price: number({
        required_error: "Product price is required",
    }).nonnegative(),
    product_desc: string().max(1000, "Description have maximum 1000 characters").optional(),
    isPublish: boolean(),
});

export const productSchema = object({
    body: discriminatedUnion("product_type", [
        object({
            ...baseProductSchema.shape,
            product_type: literal("clothes"),
            product_attribute: clothesSchema,
        }),
        object({
            ...baseProductSchema.shape,
            product_type: literal("electronics"),
            product_attribute: electronicsSchema,
        }),
        object({
            ...baseProductSchema.shape,
            product_type: literal("furniture"),
            product_attribute: furnitureSchema,
        }),
    ]),
});

export const paginationSchema = object({
    query: object({
        limit: string().default(`${LIMIT}`),
        page: string().default(`${PAGE}`),
    }),
});

export const shopIdSchema = object({
    params: object({
        shopId: string({ required_error: "Shop ID is required" }),
    }).refine(
        (data) => {
            return ObjectId.isValid(data.shopId);
        },
        {
            message: "Invalid shopId",
            path: ["shopId"],
        }
    ),
});

export const productIdSchema = object({
    params: object({
        productId: string({ required_error: "Product ID is required" }),
    }).refine(
        (data) => {
            return ObjectId.isValid(data.productId);
        },
        {
            message: "Invalid productId",
            path: ["productId"],
        }
    ),
});

export const productSearchSchema = object({
    query: object({
        keyword: string({ required_error: "Keyword is required" }).max(200, "Keyword have maximum 200 characters"),
        limit: string().default(`${LIMIT}`),
        page: string().default(`${PAGE}`),
    }),
});

export type ShopIdInput = TypeOf<typeof shopIdSchema>;

export type ProductIdInput = TypeOf<typeof productIdSchema>;

export type PaginationInput = TypeOf<typeof paginationSchema>;

export type ProductSearchInput = TypeOf<typeof productSearchSchema>;

export type ProductInput = TypeOf<typeof productSchema>;
