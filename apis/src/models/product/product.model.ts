import { Connection } from "mongoose";
import mongoDBInstance from "../../database/mongodb";
import ProductSchema from "./product.schema";
import { ProductDocument } from "./product.schema";

const conn: Connection = mongoDBInstance.getConnection();

const Product = conn.model<ProductDocument>("product", ProductSchema);

export default Product;
