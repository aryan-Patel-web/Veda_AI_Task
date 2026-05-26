import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        questionTypes: {
            type: [String],
            required: true,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
