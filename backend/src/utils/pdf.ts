import puppeteer from "puppeteer";
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

export const generateExamPdfBuffer = async (
    params: PdfParams,
): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        headless: true,
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