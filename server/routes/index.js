// routes/index.js
import { Router } from 'express';
import { UsersRouter } from './users.js';
import { CartItemsRouter } from './cart_items.js';
import { CartsRouter } from './carts.js';
import { ItemsRouter } from './items.js';
import { OrderItemsRouter } from './order_items.js';
import { OrdersRouter } from './orders.js';
import { ShippingAddrsRouter } from './shipping_addresses.js';

const router = Router();

router.use('/users', UsersRouter);
router.use('/cart-items', CartItemsRouter);
router.use('/carts', CartsRouter);
router.use('/items', ItemsRouter);
router.use('/order-items', OrderItemsRouter);
router.use('/orders', OrdersRouter);
router.use('/shipping-addresses', ShippingAddrsRouter);

export { router as apiRouter };