import { object, string, TypeOf } from 'zod';

const shopSchema = object({
    body: object({
        name: string().min(6, 'Name should be 6 character minimum').max(30, 'Name should be 30 character maximum'),
        email: string().email(),
        phone: string().length(10, 'Phone have to be 10 character'),
        password: string().min(8, 'Password should be 8 character minimum'),
        confirm: string().min(8, 'Password should be 8 character minimum')
    }).refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ['confirm']
    })
});

export type ShopInput = {
    body: Omit<TypeOf<typeof shopSchema>['body'], 'confirm'>;
};

export default shopSchema;
