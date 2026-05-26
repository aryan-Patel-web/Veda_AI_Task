import mongoose from "mongoose";
import Subject from "../models/subject.model.js";
import dotenv from "dotenv";
dotenv.config();

const subjects = [
    {
        name: "English",
        questionTypes: ["mcq", "short", "long", "grammar", "passage"],
    },
    {
        name: "Hindi",
        questionTypes: ["mcq", "short", "long", "grammar", "passage"],
    },
    {
        name: "Maths",
        questionTypes: ["mcq", "derivation", "numerical", "short", "long"],
    },
    {
        name: "Physics",
        questionTypes: ["mcq", "short", "long", "numerical"],
    },
    {
        name: "Chemistry",
        questionTypes: ["mcq", "short", "long", "numerical"],
    },
    {
        name: "Biology",
        questionTypes: ["mcq", "short", "long", "diagram"],
    },
    {
        name: "Commerce",
        questionTypes: ["mcq", "short", "long", "case_study"],
    },
];

async function run(): Promise<void> {
    const mongoUri = process.env.DB_URL;

    if (!mongoUri) {
        throw new Error("DB_URL is not set.");
    }

    await mongoose.connect(mongoUri);

    for (const subject of subjects) {
        await Subject.updateOne(
            { name: subject.name },
            { $set: subject },
            { upsert: true },
        );
    }

    await mongoose.disconnect();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
