import mongoose, { Schema } from "mongoose";

const pendingSignupSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true },
        verificationCodeHash: { type: String, required: true },
        verificationExpiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

const PendingSignup = mongoose.model("PendingSignup", pendingSignupSchema);

export default PendingSignup;
