import { Router } from "express";
import {
    createAssignment,
    deleteAssignment,
    getAssignmentById,
    getAssignments,
    getResultById,
    getResultPdf,
} from "../controllers/assignment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

const router = Router();

router.post("/", verifyToken, upload.single("pdfFile"), createAssignment);
router.get("/", verifyToken, getAssignments);
router.get("/:id", verifyToken, getAssignmentById);
router.get("/:id/result", verifyToken, getResultById);
router.get("/:id/result/pdf", verifyToken, getResultPdf);
router.delete("/:id", verifyToken, deleteAssignment);

export default router;
