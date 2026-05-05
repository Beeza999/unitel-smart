import express from 'express';
import { getPackage, getPackages, getPromotions, getSim, getSims } from '../controllers/catalogController.js';
const router = express.Router();
router.get('/sims', getSims);
router.get('/sims/:id', getSim);
router.get('/packages', getPackages);
router.get('/packages/:id', getPackage);
router.get('/promotions', getPromotions);
export default router;
