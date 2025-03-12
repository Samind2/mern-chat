import express from 'express';
const router = express.Router();
import { signup, signin,signout, updateProfile } from '../controllers/auth.controller.js'; 


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/updateProfile/:id", updateProfile);

export default router;
