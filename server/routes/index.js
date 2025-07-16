// routes/index.js
import { Router } from "express";
import { UsersRouter } from "./users.js";
import { CartItemsRouter } from "./cart_items.js";
import { CartsRouter } from "./carts.js";
import { ItemsRouter } from "./items.js";
import { OrderItemsRouter } from "./order_items.js";
import { OrdersRouter } from "./orders.js";
import { AddressRouter } from './shipping_addresses.js';
import { S3Router } from "./s3.js";
import { InquiriesRouter } from "./inquiries.js";

const router = Router();

router.use("/users", UsersRouter);
router.use("/cart-items", CartItemsRouter);
router.use("/carts", CartsRouter);
router.use("/items", ItemsRouter);
router.use("/order-items", OrderItemsRouter);
router.use("/orders", OrdersRouter);
router.use("/shipping-addresses", AddressRouter);
router.use("/s3", S3Router);
router.use("/inquiries", InquiriesRouter);

export { router as apiRouter };
