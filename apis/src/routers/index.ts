import express, { type Router } from "express";
import accessRoute from "./access/index";
import shopRoute from "./shop/index";
import productRoute from "./product/index";

const router: Router = express.Router();

router.use("/api", shopRoute);
router.use("/api", accessRoute);
router.use("/api", productRoute);

export default router;
