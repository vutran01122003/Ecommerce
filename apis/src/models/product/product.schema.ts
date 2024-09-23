import mongoose, { Schema } from 'mongoose';

export interface ProductDocument extends mongoose.Document {
    product_title: string;
    product_thumb: string;
    product_images: string;
    product_quantity: number;
    product_quantity_sold: number;
    product_price: number;
    product_desc: string;
    product_attribute: {};
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
    type: [string];
}

export interface FurnitureDocument extends mongoose.Document {
    manufacturer: string;
    product_model: string;
    color: [string];
    type: [string];
}

export const ProductSchema = new Schema({
    product_title: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        default: ''
    },
    product_images: {
        type: [String],
        default: []
    },
    product_quantity: {
        type: Number,
        default: 0
    },
    product_quantity_sold: {
        type: Number,
        default: 0
    },
    product_price: {
        type: Number,
        required: true
    },
    product_desc: String,
    product_attribute: Schema.Types.Mixed
});

export const ClothesSchema = new Schema({
    material: String,
    size: [String],
    color: [String]
});

export const ElectronicsSchema = new Schema({
    manufacturer: String,
    product_model: String,
    color: [String],
    type: [String]
});

export const FurnitureSchema = new Schema({
    manufacturer: String,
    product_model: String,
    color: [String],
    type: [String]
});
