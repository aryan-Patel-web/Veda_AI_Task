import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        avatarUrl: {
            type: String,
            default: undefined,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        isEmailVerified: { type: Boolean, default: false },
        emailVerificationCodeHash: { type: String, default: undefined },
        emailVerificationExpiresAt: { type: Date, default: undefined },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
