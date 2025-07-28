import express from "express";
import {
  getUserProfile,
  googleLogin,
  sendOTP,
  verifyOTP,
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getUserProfile);

export default router;
