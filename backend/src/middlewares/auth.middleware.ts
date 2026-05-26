import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token
        if(!token){
            res.status(404).json({
                success:false,
                message: "Token not found"
            })
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET") as JwtPayload
        
        (req as any).user = decoded
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}