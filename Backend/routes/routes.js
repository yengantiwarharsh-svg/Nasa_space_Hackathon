import express from "express";
import { registerUser, addHistory , LoginUser } from "../controllers/userController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/history", addHistory);
router.post("/login", LoginUser );

export default router;
