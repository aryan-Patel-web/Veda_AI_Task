import type { Request, Response } from "express";
import mongoose from "mongoose";
import pdfParse from "pdf-parse";
import Assignment from "../models/assignment.model.js";
import Result from "../models/result.model.js";
import Subject from "../models/subject.model.js";
import { assignmentSchema } from "../validation/validateSchema.js";
import { assignmentQueue } from "../queues/assignment.queue.js";
import { uploadPdfToS3 } from "../utils/s3.js";

type AssignmentCreateInput = Record<string, unknown> & {
    payload?: string;
    fileText?: string;
    pdfText?: string;
};

const buildSourcePdfKey = (userId: string, assignmentId: string) =>
    `users/${userId}/assignments/${assignmentId}/source.pdf`;

const parseAssignmentPayload = (body: AssignmentCreateInput) => {
    if (typeof body.payload === "string" && body.payload.trim()) {
        try {
            return JSON.parse(body.payload);
        } catch {
            return null;
        }
    }

    return body;
};

export const createAssignment = async (req: Request, res: Response) => {
    try {
        const incomingBody = req.body as AssignmentCreateInput;
        const parsedInput = parseAssignmentPayload(incomingBody);
        if (!parsedInput) {
            res.status(400).json({
                success: false,
                message: "Invalid payload format",
            });
            return;
        }
        const parsed = assignmentSchema.safeParse(parsedInput);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const assignmentId = new mongoose.Types.ObjectId();

        const assignmentPayload = Object.fromEntries(
            Object.entries({
                ...parsed.data,
                ownerId: userId,
                status: "pending",
                pdfText:
                    parsed.data.pdfText ??
                    parsedInput.pdfText ??
                    parsedInput.fileText,
            }).filter(([, value]) => value !== undefined),
        ) as Record<string, unknown>;

        const uploadedPdf = (req as Request & { file?: Express.Multer.File })
            .file;
        if (uploadedPdf?.buffer?.length) {
            if (uploadedPdf.mimetype !== "application/pdf") {
                res.status(400).json({
                    success: false,
                    message: "Only PDF files are allowed",
                });
                return;
            }
            const parsedPdf = await pdfParse(uploadedPdf.buffer);
            if (parsedPdf.text?.trim()) {
                assignmentPayload.pdfText = parsedPdf.text;
            }

            const sourcePdfKey = buildSourcePdfKey(
                userId,
                assignmentId.toString(),
            );
            const sourcePdfUrl = await uploadPdfToS3(
                uploadedPdf.buffer,
                sourcePdfKey,
            );
            assignmentPayload.sourcePdfUrl = sourcePdfUrl;
            assignmentPayload.sourcePdfKey = sourcePdfKey;
            assignmentPayload.sourcePdfName = uploadedPdf.originalname;
        }

        const assignment = await Assignment.create({
            _id: assignmentId,
            ...assignmentPayload,
        });

        console.log("Assignment created with ID", {
            assignmentId: assignment._id,
        });

        const job = await assignmentQueue.add(
            "generate-assignment",
            { assignmentId: assignment._id },
            {
                removeOnComplete: true,
                removeOnFail: false,
            },
        );

        console.log("Job added to queue", {
            jobId: job.id,
            assignmentId: assignment._id,
        });

        await Assignment.findByIdAndUpdate(assignment._id, {
            jobId: job.id,
        });

        res.status(201).json({
            success: true,
            message: "Assignment created",
            assignmentId: assignment._id,
            jobId: job.id,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAssignments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const {
            status,
            subjectId,
            gradeLevel,
            search,
            from,
            to,
            page = "1",
            limit = "20",
        } = req.query;

        const filter: Record<string, unknown> = { ownerId: userId };

        if (typeof status === "string") {
            filter.status = status;
        }
        if (typeof subjectId === "string") {
            if (!mongoose.isValidObjectId(subjectId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid subjectId",
                });
                return;
            }
            filter.subjectId = subjectId;
        }
        if (typeof gradeLevel === "string") {
            filter.gradeLevel = gradeLevel;
        }
        if (typeof search === "string" && search.trim()) {
            filter.title = { $regex: search.trim(), $options: "i" };
        }
        if (typeof from === "string" || typeof to === "string") {
            filter.createdAt = {};
            if (typeof from === "string" && from.trim()) {
                (filter.createdAt as Record<string, Date>).$gte = new Date(
                    from,
                );
            }
            if (typeof to === "string" && to.trim()) {
                (filter.createdAt as Record<string, Date>).$lte = new Date(to);
            }
        }

        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNumber - 1) * limitNumber;

        const [assignments, total] = await Promise.all([
            Assignment.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            Assignment.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: assignments,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAssignmentById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const rawId = (req.params as { id?: string | string[] }).id;
        if (
            !rawId ||
            Array.isArray(rawId) ||
            !mongoose.isValidObjectId(rawId)
        ) {
            res.status(400).json({ success: false, message: "Invalid id" });
            return;
        }
        const id = rawId as string;

        const assignment = await Assignment.findOne({
            _id: id,
            ownerId: new mongoose.Types.ObjectId(userId),
        }).lean();
        if (!assignment) {
            res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
            return;
        }

        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getResultById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid id" });
            return;
        }

        const rawResultId = id as string;

        const result = await Result.findOne({
            assignmentId: new mongoose.Types.ObjectId(rawResultId),
            ownerId: new mongoose.Types.ObjectId(userId),
        }).lean();
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Result not found",
            });
            return;
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getResultPdf = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid id" });
            return;
        }
        const rawId = id as string;

        const result = await Result.findOne({
            assignmentId: new mongoose.Types.ObjectId(rawId),
            ownerId: new mongoose.Types.ObjectId(userId),
        })
            .select("pdfUrl")
            .lean();
        if (!result?.pdfUrl) {
            res.status(404).json({ success: false, message: "PDF not found" });
            return;
        }

        res.redirect(result.pdfUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteAssignment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid id" });
            return;
        }
        const rawId = id as string;

        const assignmentObjectId = new mongoose.Types.ObjectId(rawId);
        const ownerObjectId = new mongoose.Types.ObjectId(userId);

        const assignment = await Assignment.findOne({
            _id: assignmentObjectId,
            ownerId: ownerObjectId,
        })
            .select("jobId")
            .lean();

        if (!assignment) {
            res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
            return;
        }

        if (assignment.jobId) {
            const job = await assignmentQueue.getJob(assignment.jobId);
            if (job) {
                await job.remove();
            }
        }

        await Promise.all([
            Result.deleteMany({
                assignmentId: assignmentObjectId,
                ownerId: ownerObjectId,
            }),
            Assignment.deleteOne({
                _id: assignmentObjectId,
                ownerId: ownerObjectId,
            }),
        ]);

        res.status(200).json({ success: true, message: "Assignment deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
