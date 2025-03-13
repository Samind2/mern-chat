import express from 'express';
const router = express.Router();
import { signup, signin,signout, updateProfile } from '../controllers/auth.controller.js'; 
import { protectedRoute } from '../middleware/auth.middleware.js';


router.post("/signup", signup); 
router.post("/signin",protectedRoute, signin);
router.post("/signout", signout);
router.put("/updateProfile/:id", updateProfile);

export default router;
