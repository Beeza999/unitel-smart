import express from 'express';
import { createOrder, getOrder, myOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/auth.js';
const router = express.Router();
router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', myOrders);
router.get('/:id', getOrder);
export default router;
