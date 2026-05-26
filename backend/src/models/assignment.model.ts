import mongoose, { Schema } from "mongoose";
import Subject from "./subject.model.js";

const questionBreakdownSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
        },
        count: {
            type: Number,
            required: true,
            min: 1,
        },
        marksPerQuestion: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false },
);

const assignmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        gradeLevel: { type: String, required: true, trim: true },
        schoolName: { type: String, default: undefined, trim: true },
        dueDate: { type: Date, required: true },
        questionBreakdown: {
            type: [questionBreakdownSchema],
            required: true,
            validate: {
                validator: async function (
                    this: any,
                    value: { type: string }[],
                ) {
                    if (!this.subjectId) {
                        return false;
                    }

                    const subject = await Subject.findById(this.subjectId)
                        .select("questionTypes")
                        .lean();

                    if (!subject) {
                        return false;
                    }

                    const selectedTypes = value.map((item) => item.type);
                    const uniqueTypes = new Set(selectedTypes);
                    if (uniqueTypes.size !== selectedTypes.length) {
                        return false;
                    }

                    return selectedTypes.every((type) =>
                        subject.questionTypes.includes(type),
                    );
                },
                message:
                    "questionBreakdown contains values not allowed for selected subject.",
            },
        },
        totalQuestions: { type: Number, required: true, min: 1 },
        totalMarks: {
            type: Number,
            required: true,
            min: 0,
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["easy", "medium", "hard", "mixed"],
        },
        additionalInstructions: {
            type: String,
            default: undefined,
            trim: true,
        },
        pdfText: {
            type: String,
            default: undefined,
        },
        sourcePdfUrl: {
            type: String,
            default: undefined,
        },
        sourcePdfKey: {
            type: String,
            default: undefined,
        },
        sourcePdfName: {
            type: String,
            default: undefined,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },
        jobId: {
            type: String,
            default: undefined,
        },
    },
    { timestamps: true },
);

assignmentSchema.pre("validate", function () {
    if (this.questionBreakdown?.length) {
        this.totalQuestions = this.questionBreakdown.reduce(
            (sum: number, item: { count: number }) => sum + item.count,
            0,
        );
        this.totalMarks = this.questionBreakdown.reduce(
            (sum: number, item: { count: number; marksPerQuestion: number }) =>
                sum + item.count * item.marksPerQuestion,
            0,
        );
    }
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
