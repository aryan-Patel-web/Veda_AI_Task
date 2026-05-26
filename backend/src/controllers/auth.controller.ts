import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import PendingSignup from "../models/pendingSignup.model.js";
import User from "../models/user.model.js";
import {
    resendVerificationSchema,
    signInSchema,
    signUpSchema,
    verifyEmailSchema,
} from "../validation/validateSchema.js";
import { sendVerificationEmail } from "../utils/emailFn.js";



dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "SECRET";

const buildVerificationCode = () =>
    crypto.randomInt(0, 1000000).toString().padStart(6, "0");

const buildVerificationExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

export const signup = async (req: Request, res: Response) => {
    try {
        const parsed = signUpSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { firstName, lastName, email, password } = parsed.data;

        const userExist = await User.findOne({ email });
        if (userExist) {
            if (userExist.isEmailVerified) {
                res.status(400).json({
                    success: false,
                    message: "User already exists with that email",
                });
                return;
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const verificationCode = buildVerificationCode();
            const emailVerificationCodeHash = await bcrypt.hash(
                verificationCode,
                10,
            );
            const emailVerificationExpiresAt = buildVerificationExpiry();

            await User.findByIdAndUpdate(userExist._id, {
                passwordHash,
                emailVerificationCodeHash,
                emailVerificationExpiresAt,
            });

            await PendingSignup.deleteOne({ email });

            try {
                await sendVerificationEmail({
                    to: email,
                    userName: `${firstName} ${lastName}`.trim(),
                    code: verificationCode,
                });
            } catch (mailError) {
                console.error(mailError);
                res.status(500).json({
                    success: false,
                    message:
                        "Could not send verification email. Check SMTP settings.",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Verification code sent.",
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const verificationCode = buildVerificationCode();
        const verificationCodeHash = await bcrypt.hash(verificationCode, 10);
        const verificationExpiresAt = buildVerificationExpiry();

        await PendingSignup.findOneAndUpdate(
            { email },
            {
                firstName,
                lastName,
                email,
                passwordHash,
                verificationCodeHash,
                verificationExpiresAt,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        try {
            await sendVerificationEmail({
                to: email,
                userName: `${firstName} ${lastName}`.trim(),
                code: verificationCode,
            });
        } catch (mailError) {
            console.error(mailError);
            res.status(500).json({
                success: false,
                message:
                    "Could not send verification email. Check SMTP settings.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Verification code sent.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const parsed = signInSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        if (!user.isEmailVerified) {
            res.status(403).json({
                success: false,
                message: "Please verify your email before signing in.",
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Password is wrong",
            });
            return;
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: "30d",
        });

        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json({
                success: true,
                message: "User signed in successfully",
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    token: token,
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

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const parsed = verifyEmailSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { email, code } = parsed.data;
        const user = await User.findOne({ email });
        if (user) {
            if (user.isEmailVerified) {
                res.status(200).json({
                    success: true,
                    message: "Email already verified",
                });
                return;
            }

            if (
                !user.emailVerificationCodeHash ||
                !user.emailVerificationExpiresAt
            ) {
                res.status(400).json({
                    success: false,
                    message: "No verification code found",
                });
                return;
            }

            if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
                res.status(400).json({
                    success: false,
                    message: "Verification code expired",
                });
                return;
            }

            const isMatch = await bcrypt.compare(
                code,
                user.emailVerificationCodeHash,
            );

            if (!isMatch) {
                res.status(400).json({
                    success: false,
                    message: "Invalid verification code",
                });
                return;
            }

            await User.findByIdAndUpdate(user._id, {
                isEmailVerified: true,
                emailVerificationCodeHash: undefined,
                emailVerificationExpiresAt: undefined,
            });

            res.status(200).json({
                success: true,
                message: "Email verified successfully",
            });
            return;
        }

        const pendingSignup = await PendingSignup.findOne({ email });
        if (!pendingSignup) {
            res.status(404).json({
                success: false,
                message: "Signup request not found",
            });
            return;
        }

        if (pendingSignup.verificationExpiresAt.getTime() < Date.now()) {
            res.status(400).json({
                success: false,
                message: "Verification code expired",
            });
            return;
        }

        const isMatch = await bcrypt.compare(
            code,
            pendingSignup.verificationCodeHash,
        );

        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid verification code",
            });
            return;
        }

        const newUser = await User.create({
            firstName: pendingSignup.firstName,
            lastName: pendingSignup.lastName,
            email: pendingSignup.email,
            passwordHash: pendingSignup.passwordHash,
            isEmailVerified: true,
        });

        await PendingSignup.deleteOne({ _id: pendingSignup._id });

        res.status(201).json({
            success: true,
            message: "Email verified. Account created successfully.",
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
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

export const resendVerification = async (req: Request, res: Response) => {
    try {
        const parsed = resendVerificationSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { email } = parsed.data;
        const user = await User.findOne({ email });
        if (user) {
            if (user.isEmailVerified) {
                res.status(200).json({
                    success: true,
                    message: "Email already verified",
                });
                return;
            }

            const verificationCode = buildVerificationCode();
            const emailVerificationCodeHash = await bcrypt.hash(
                verificationCode,
                10,
            );
            const emailVerificationExpiresAt = buildVerificationExpiry();

            await User.findByIdAndUpdate(user._id, {
                emailVerificationCodeHash,
                emailVerificationExpiresAt,
            });

            try {
                await sendVerificationEmail({
                    to: user.email,
                    userName: `${user.firstName} ${user.lastName}`.trim(),
                    code: verificationCode,
                });
            } catch (mailError) {
                console.error(mailError);
                res.status(500).json({
                    success: false,
                    message:
                        "Could not send verification email. Check SMTP settings.",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Verification code sent",
            });
            return;
        }

        const pendingSignup = await PendingSignup.findOne({ email });
        if (!pendingSignup) {
            res.status(404).json({
                success: false,
                message: "Signup request not found",
            });
            return;
        }

        const verificationCode = buildVerificationCode();
        const verificationCodeHash = await bcrypt.hash(verificationCode, 10);
        const verificationExpiresAt = buildVerificationExpiry();

        await PendingSignup.findByIdAndUpdate(pendingSignup._id, {
            verificationCodeHash,
            verificationExpiresAt,
        });

        try {
            await sendVerificationEmail({
                to: pendingSignup.email,
                userName:
                    `${pendingSignup.firstName} ${pendingSignup.lastName}`.trim(),
                code: verificationCode,
            });
        } catch (mailError) {
            console.error(mailError);
            res.status(500).json({
                success: false,
                message:
                    "Could not send verification email. Check SMTP settings.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Verification code sent",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const user = await User.findById(userId)
            .select("firstName lastName email")
            .lean();

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    res.status(200).json({ success: true, message: "Logged out" });
};
