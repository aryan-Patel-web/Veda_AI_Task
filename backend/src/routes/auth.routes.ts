import { Router } from "express";
import {
    getMe,
    logout,
    resendVerification,
    signin,
    signup,
    verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

export default router;
