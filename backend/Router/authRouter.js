import express from 'express';
import signinController from '../controllers/signinController.js';
import signupController from '../controllers/signupController.js';
const router=express.Router();

router.post('/signup',signupController);
router.post('/signin',signinController);
export default router;