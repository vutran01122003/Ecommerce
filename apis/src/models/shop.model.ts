import mongoose, { type CallbackWithoutResultAndOptionalError, type Connection, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import _default from '../../config/default';
import mongoDBInstance from '../database/mongoDB';

const conn: Connection = mongoDBInstance.getConnection();

export interface ShopDocument extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    status: String;
    roles: Array<String>;
    comparePassword(password: string): Boolean;
}

const ShopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        roles: {
            type: Array<String>,
            default: []
        }
    },
    {
        timestamps: true
    }
);

ShopSchema.pre('save', function (this: ShopDocument, next: CallbackWithoutResultAndOptionalError) {
    try {
        const salt = bcrypt.genSaltSync(_default.SALT_WORK_FACTORY);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

ShopSchema.methods.comparePassword = function (password: string) {
    try {
        const shop = this as ShopDocument;
        return bcrypt.compareSync(password, shop.password);
    } catch (error) {
        throw error;
    }
};

const Shop = conn.model<ShopDocument>('shop', ShopSchema);

export default Shop;
