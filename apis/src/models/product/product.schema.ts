import mongoose, { Schema } from "mongoose";
import { ShopDocument } from "../shop.model";
import { productCatalog } from "../../shared/productCatalog";

export interface ProductDocument extends mongoose.Document {
    shop: ShopDocument["_id"];
    product_name: string;
    product_thumb: string;
    product_images: string;
    product_type: string;
    product_variation: [string];
    product_quantity: number;
    product_quantity_sold: number;
    product_price: number;
    product_desc: string;
    product_attribute: ClothesDocument | ElectronicsDocument | FurnitureDocument;
    isPublish: boolean;
}

export interface ClothesDocument extends mongoose.Document {
    material: string;
    size: [string];
    color: [string];
}

export interface ElectronicsDocument extends mongoose.Document {
    manufacturer: string;
    product_model: string;
    color: [string];
}

export interface FurnitureDocument extends mongoose.Document {
    manufacturer: string;
    material: string;
    color: [string];
}

export const ClothesSchema = new Schema({
    material: String,
    size: [String],
    color: [String],
});

export const ElectronicsSchema = new Schema({
    manufacturer: String,
    product_model: String,
    color: [String],
});

export const FurnitureSchema = new Schema({
    manufacturer: String,
    material: String,
    color: [String],
});

const ProductSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        ref: "shop",
    },
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        default: "",
    },
    product_images: {
        type: [String],
        default: [],
    },
    product_type: {
        type: String,
        required: true,
        lowercase: true,
        enum: productCatalog,
    },
    product_variation: {
        type: [String],
        default: [],
    },
    product_quantity: {
        type: Number,
        default: 0,
    },
    product_quantity_sold: {
        type: Number,
        default: 0,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_desc: String,
    product_attribute: {
        type: {},
        enum: [ClothesSchema, ElectronicsSchema, FurnitureSchema],
    },
    isPublish: {
        type: Boolean,
        default: false,
    },
});

ProductSchema.index({ product_name: "text", product_desc: "text" });

export default ProductSchema;
