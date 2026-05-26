import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
        credentials: true,
    }),
);

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/subjects", subjectRoutes);

await connectDB();
app.listen(port, () => {
    console.log("Server is running on port " + port);
});
