import express from 'express';
import { adminOnly, protect } from '../middlewares/auth.js';
import {
  dashboard, reports,
  listSims, createSim, updateSim, deleteSim,
  listPackages, createPackage, updatePackage, deletePackage,
  listOrders, updateOrderStatus, listCustomers,
  listPromotions, createPromotion, updatePromotion, deletePromotion
} from '../controllers/adminController.js';
const router = express.Router();
router.use(protect, adminOnly);
router.get('/dashboard', dashboard);
router.get('/reports', reports);
router.route('/sims').get(listSims).post(createSim);
router.route('/sims/:id').put(updateSim).delete(deleteSim);
router.route('/packages').get(listPackages).post(createPackage);
router.route('/packages/:id').put(updatePackage).delete(deletePackage);
router.get('/orders', listOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/customers', listCustomers);
router.route('/promotions').get(listPromotions).post(createPromotion);
router.route('/promotions/:id').put(updatePromotion).delete(deletePromotion);
export default router;
