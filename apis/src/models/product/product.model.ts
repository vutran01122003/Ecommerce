import { Connection } from 'mongoose';
import mongoDBInstance from '../../database/mongoDB';
import { ClothesSchema, ElectronicsSchema, FurnitureSchema, ProductSchema } from './product.schema';
import { ClothesDocument, ElectronicsDocument, FurnitureDocument, ProductDocument } from './product.schema';

const conn: Connection = mongoDBInstance.getConnection();

const Product = conn.model<ProductDocument>('product', ProductSchema);
const Electronics = conn.model<ElectronicsDocument>('electronics', ElectronicsSchema);
const Clothes = conn.model<ClothesDocument>('clothes', ClothesSchema);
const Furniture = conn.model<FurnitureDocument>('furniture', FurnitureSchema);

export { Product, Electronics, Clothes, Furniture };
