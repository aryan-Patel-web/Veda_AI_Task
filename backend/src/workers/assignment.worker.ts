import { Worker } from "bullmq";
import dotenv from "dotenv";
import OpenAI from "openai";
import Assignment from "../models/assignment.model.js";
import Result from "../models/result.model.js";
import User from "../models/user.model.js";
import Subject from "../models/subject.model.js";
import { connectDB } from "../config/database.js";
import {
    emailQueue,
    assignmentQueueConnection,
    assignmentQueueName,
} from "../queues/assignment.queue.js";
import {
    ASSIGNMENT_SYSTEM_PROMPT,
    buildAssignmentUserPrompt,
    type AssignmentPromptInput,
} from "../utils/prompt.js";
import { extractJson } from "../utils/json.js";
import {
    resultPayloadSchema,
    validateGeneratedQuestions,
    type ResultPayload,
} from "../validation/resultSchema.js";
import { generateExamPdfBuffer } from "../utils/pdf.js";
import { uploadPdfToS3 } from "../utils/s3.js";
import { compressPdfText } from "../utils/compress.js";

dotenv.config();

const generatePdfUrl = async (
    resultId: string,
    payload: ResultPayload,
    meta: {
        title: string;
        schoolName?: string;
        subjectName: string;
        gradeLevel: string;
        examDate: Date;
        totalMarks: number;
    },
): Promise<string> => {
    const pdfParams = {
        title: meta.title,
        subjectName: meta.subjectName,
        gradeLevel: meta.gradeLevel,
        examDate: meta.examDate,
        totalMarks: meta.totalMarks,
        sections: payload.sections,
        answerKey: payload.answerKey,
        ...(meta.schoolName ? { schoolName: meta.schoolName } : {}),
    };
    const pdfBuffer = await generateExamPdfBuffer(pdfParams);

    const key = `results/${resultId}.pdf`;
    return uploadPdfToS3(pdfBuffer, key);
};

const startWorker = async () => {
    await connectDB();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const client = new OpenAI({
        apiKey,
        baseURL:
            process.env.GEMINI_BASE_URL ??
            "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const worker = new Worker(
        assignmentQueueName,
        async (job) => {
            const { assignmentId } = job.data;
            if (!assignmentId) {
                throw new Error("assignmentId is required");
            }

            console.log("Processing assignment", { assignmentId });

            await Assignment.findByIdAndUpdate(assignmentId, {
                status: "processing",
            });

            console.log("Assignment updated to processing", { assignmentId });

            const assignment = await Assignment.findById(assignmentId).lean();
            if (!assignment) {
                throw new Error("Assignment not found");
            }

            const subject = await Subject.findById(assignment.subjectId)
                .select("name")
                .lean();
            if (!subject?.name) {
                throw new Error("Subject not found");
            }

            const compressedPdfText = assignment.pdfText
                ? await compressPdfText(
                      assignment.pdfText,
                      client,
                      process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
                  )
                : undefined;

            const promptInput: AssignmentPromptInput = {
                title: assignment.title,
                subjectName: subject.name,
                gradeLevel: assignment.gradeLevel,
                schoolName: assignment.schoolName as string,
                dueDate:
                    assignment.dueDate?.toISOString() ??
                    new Date().toISOString(),
                difficulty: assignment.difficulty,
                questionBreakdown: assignment.questionBreakdown ?? [],
                totalQuestions: assignment.totalQuestions,
                totalMarks: assignment.totalMarks,
                additionalInstructions:
                    assignment.additionalInstructions as string,
                pdfText: compressedPdfText as string,
            };

            const userPrompt = buildAssignmentUserPrompt(promptInput);
            console.log("Generated user prompt for assignment", { userPrompt });
            const response = await client.chat.completions.create({
                model: process.env.GEMINI_MODEL ?? "gemini-3-flash-preview",
                messages: [
                    { role: "system", content: ASSIGNMENT_SYSTEM_PROMPT },
                    { role: "user", content: userPrompt },
                ],
            });
            const rawText = response.choices[0]?.message?.content ?? "";
            console.log("Generated raw text for assignment", { rawText });
            const parsedJson = extractJson(rawText);
            const generatedPayload = resultPayloadSchema.parse(parsedJson);

            validateGeneratedQuestions(
                generatedPayload,
                assignment.questionBreakdown ?? [],
                assignment.totalQuestions,
                assignment.totalMarks,
            );

            const resultDoc = await Result.create({
                assignmentId: assignment._id,
                ownerId: assignment.ownerId,
                subjectId: assignment.subjectId,
                title: assignment.title,
                schoolName: assignment.schoolName as string,
                subjectName: subject.name,
                gradeLevel: assignment.gradeLevel,
                examDate: assignment.dueDate,
                questionBreakdown: assignment.questionBreakdown ?? [],
                sections: generatedPayload.sections,
                answerKey: generatedPayload.answerKey ?? [],
                totalMarks: assignment.totalMarks,
                totalQuestions: assignment.totalQuestions,
            });

            const pdfUrl = await generatePdfUrl(
                resultDoc._id.toString(),
                generatedPayload,
                {
                    title: assignment.title,
                    schoolName: assignment.schoolName as string,
                    subjectName: subject.name,
                    gradeLevel: assignment.gradeLevel,
                    examDate: assignment.dueDate,
                    totalMarks: assignment.totalMarks,
                },
            );

            await Result.findByIdAndUpdate(resultDoc._id, {
                pdfUrl,
            });

            await Assignment.findByIdAndUpdate(assignmentId, {
                status: "completed",
            });

            const assignmentOwner =
                await Assignment.findById(assignmentId).select("ownerId title");

            if (assignmentOwner?.ownerId) {
                const user = await User.findById(
                    assignmentOwner.ownerId,
                ).select("email firstName lastName");

                if (user?.email) {
                    const requestSummary = `Request: ${subject.name} · Grade ${assignment.gradeLevel} · ${assignment.totalMarks} marks · ${assignment.totalQuestions} questions`;
                    console.log("Queueing email with summary:", requestSummary);
                    await emailQueue.add("assignment-complete", {
                        to: user.email,
                        assignmentTitle: assignmentOwner.title,
                        pdfUrl,
                        userName: `${user.firstName} ${user.lastName}`.trim(),
                        assignmentId,
                        resultId: resultDoc._id.toString(),
                        requestSummary,
                    });
                    console.log(
                        "Email job added to queue for user:",
                        user.email,
                    );
                }
            }
        },
        { connection: assignmentQueueConnection },
    );

    worker.on("failed", async (job, error) => {
        if (job?.data?.assignmentId) {
            await Assignment.findByIdAndUpdate(job.data.assignmentId, {
                status: "failed",
            });

            const assignment = await Assignment.findById(
                job.data.assignmentId,
            ).select("ownerId title");

            if (assignment?.ownerId) {
                const user = await User.findById(assignment.ownerId).select(
                    "email firstName lastName",
                );

                if (user?.email) {
                    await emailQueue.add("assignment-failed", {
                        to: user.email,
                        assignmentTitle: assignment.title,
                        userName: `${user.firstName} ${user.lastName}`.trim(),
                        assignmentId: job.data.assignmentId,
                        failureReason: error?.message?.slice(0, 200),
                    });
                }
            }
        }
        console.error("Assignment job failed", error);
    });
};

startWorker().catch((error) => {
    console.error(error);
    process.exit(1);
});
