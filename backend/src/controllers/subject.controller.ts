import type { Request, Response } from "express";
import Subject from "../models/subject.model.js";
import { createSubjectSchema } from "../validation/validateSchema.js";

export const getSubjects = async (_req: Request, res: Response) => {
    try {
        const subjects = await Subject.find({ isActive: true })
            .select("name questionTypes")
            .lean();
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const createSubject = async (req: Request, res: Response) => {
    try {
        const parsedData = createSubjectSchema.safeParse(req.body);
        if(!parsedData.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
            });
        }
        const { name, questionTypes } = parsedData.data;
        const existingSubject = await Subject.findOne({ name: name.trim() });
        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: "Subject with that name already exists",
            });
        }
        const newSubject = await Subject.create({
            name: name.trim(),
            questionTypes: questionTypes.map((qt) => qt.toLowerCase().trim()),
        });
        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: {
                id: newSubject._id,
                name: newSubject.name,
                questionTypes: newSubject.questionTypes,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "Invalid input data",
        });
    }
};
