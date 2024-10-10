import express, { type Router } from 'express';
import shopController from '../../controllers/shop.controller';
import auth from '../../middleware/auth';
import tryCatchHandler from '../../utils/tryCatch';

const router: Router = express.Router();

router.get('/shops', auth, tryCatchHandler(shopController.getShop));

export default router;
