import express from 'express';
import { getMeets } from '../controllers/getMeets.js'; // Correct import
import getAllMeets from "../controllers/getAllMeets.js";
import getProfile from "../controllers/getProfile.js";
import newMeet from "../controllers/newMeet.js";
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

const router = express.Router();

// ✅ FIXED: Changed from `POST` to `GET`, added `:meet_ID`
router.get('/getMeets/:meet_ID', getMeets);

router.post('/getAllMeets', isAuthenticated, getAllMeets);
router.get('/getProfile', getProfile);    
router.post('/newmeet', newMeet);

export default router;
