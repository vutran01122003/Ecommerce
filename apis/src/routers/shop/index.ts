import express, { type Router } from 'express';
import shopController from '../../controllers/shop.controller';
import auth from '../../middleware/auth';

const router: Router = express.Router();

router.get('/shops', auth, shopController.getShop);

export default router;
