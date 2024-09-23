import express, { Request, Response, NextFunction, Router } from 'express';
import validateInput from '../../middleware/validateResource';
import shopSchema from '../../schema/shop.schema';
import accessController from '../../controllers/access.controller';
import loginSchema from '../../schema/login.schema';
import auth from '../../middleware/auth';

const router: Router = express.Router();

router.post('/register', validateInput(shopSchema), accessController.registerAccount);
router.post('/login', validateInput(loginSchema), accessController.loginAccount);

router.use(auth);
router.get('/logout', accessController.logoutAccount);

export default router;
