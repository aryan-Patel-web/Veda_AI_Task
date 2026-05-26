import { Router } from "express";
import { createSubject, getSubjects } from "../controllers/subject.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getSubjects);
router.post("/", verifyToken, createSubject);

export default router;
