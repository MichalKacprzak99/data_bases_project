import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/user', userController.getUserInfo);
router.post('/sent_message', userController.sendMessage);
router.post('/get_info', userController.getInfo);
router.post('/add_tracked_product', userController.addTrackedProduct);
router.post('/get_tracked_products', userController.getTrackedProducts);



export default router;