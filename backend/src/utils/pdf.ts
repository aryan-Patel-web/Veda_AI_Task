// import puppeteer from "puppeteer";
// import type { ResultPayload } from "../validation/resultSchema.js";
// import { buildExamHtml } from "./pdfTemplate.js";

// type PdfParams = {
//     title: string;
//     schoolName?: string;
//     subjectName: string;
//     gradeLevel: string;
//     examDate: Date;
//     totalMarks: number;
//     sections: ResultPayload["sections"];
//     answerKey?: ResultPayload["answerKey"];
// };

// export const generateExamPdfBuffer = async (
//     params: PdfParams,
// ): Promise<Buffer> => {
//     const browser = await puppeteer.launch({
//         headless: true,
//         args: [
//             "--no-sandbox",
//             "--disable-setuid-sandbox",
//             "--disable-dev-shm-usage",
//             "--disable-gpu",
//             "--single-process",
//         ],
//     });
//     try {
//         const page = await browser.newPage();
//         const html = buildExamHtml(params);
//         await page.setContent(html, { waitUntil: "load" });
//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             printBackground: true,
//             margin: {
//                 top: "20mm",
//                 right: "15mm",
//                 bottom: "20mm",
//                 left: "15mm",
//             },
//         });
//         await page.close();
//         return Buffer.from(pdfBuffer);
//     } finally {
//         await browser.close();
//     }
// };

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import type { ResultPayload } from "../validation/resultSchema.js";
import { buildExamHtml } from "./pdfTemplate.js";

type PdfParams = {
    title: string;
    schoolName?: string;
    subjectName: string;
    gradeLevel: string;
    examDate: Date;
    totalMarks: number;
    sections: ResultPayload["sections"];
    answerKey?: ResultPayload["answerKey"];
};

// Find the Chrome executable in the puppeteer cache directory.
// Works for both /opt/render/project/.puppeteer_cache and local ~/.cache/puppeteer.
function findChrome(cacheDir: string): string | undefined {
    if (!fs.existsSync(cacheDir)) return undefined;
    try {
        // Walk up to 4 levels deep looking for a file called "chrome" or "chrome.exe"
        const entries = fs.readdirSync(cacheDir);
        for (const entry of entries) {
            const entryPath = path.join(cacheDir, entry);
            const stat = fs.statSync(entryPath);
            if (stat.isDirectory()) {
                const found = findChrome(entryPath);
                if (found) return found;
            } else if (entry === "chrome" || entry === "chrome.exe") {
                return entryPath;
            }
        }
    } catch {
        // ignore read errors
    }
    return undefined;
}

function getExecutablePath(): string | undefined {
    // 1. Explicit env var (highest priority)
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    // 2. Search inside PUPPETEER_CACHE_DIR
    const cacheDir = process.env.PUPPETEER_CACHE_DIR;
    if (cacheDir) {
        const found = findChrome(cacheDir);
        if (found) return found;
    }
    // 3. Let puppeteer find it itself (local dev)
    return undefined;
}

export const generateExamPdfBuffer = async (
    params: PdfParams,
): Promise<Buffer> => {
    const executablePath = getExecutablePath();
    console.log("Puppeteer executablePath:", executablePath ?? "auto-detect");

    const browser = await puppeteer.launch({
        headless: true,
        ...(executablePath ? { executablePath } : {}),
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process",
        ],
    });
    try {
        const page = await browser.newPage();
        const html = buildExamHtml(params);
        await page.setContent(html, { waitUntil: "load" });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                right: "15mm",
                bottom: "20mm",
                left: "15mm",
            },
        });
        await page.close();
        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
};