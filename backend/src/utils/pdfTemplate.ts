import type { ResultPayload } from "../validation/resultSchema.js";

type PdfTemplateParams = {
    title: string;
    schoolName?: string;
    subjectName: string;
    gradeLevel: string;
    examDate: Date;
    totalMarks: number;
    sections: ResultPayload["sections"];
    answerKey?: ResultPayload["answerKey"];
};

const escapeHtml = (value: string): string => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

export const buildExamHtml = (params: PdfTemplateParams): string => {
    const header = `
        <header class="header">
            <div class="school">${escapeHtml(params.schoolName ?? "School Name")}</div>
            <div class="title">${escapeHtml(params.title)}</div>
            <div class="meta">Subject: ${escapeHtml(params.subjectName)}</div>
            <div class="meta">Class: ${escapeHtml(params.gradeLevel)}</div>
        </header>
        <section class="meta-row">
            <span>Maximum Marks: ${params.totalMarks}</span>
        </section>
        <section class="instructions">
            <div>All questions are compulsory unless stated otherwise.</div>
        </section>
        <section class="student">
            <span>Name: __________________________</span>
            <span>Roll Number: _____________</span>
            <span>Class: ${escapeHtml(params.gradeLevel)} Section: _______</span>
        </section>
    `;

    const sectionsHtml = params.sections
        .map((section) => {
            const questionsHtml = section.questions
                .map((question) => {
                    const options = question.options?.length
                        ? `<ul class="options">${question.options
                              .map((option) => `<li>${escapeHtml(option)}</li>`)
                              .join("")}</ul>`
                        : "";
                    return `
                        <div class="question">
                            <div class="question-text">
                                <span class="number">${question.number}.</span>
                                <span>${escapeHtml(question.text)}</span>
                                <span class="marks">[${question.marks} marks]</span>
                            </div>
                            ${options}
                        </div>
                    `;
                })
                .join("");

            return `
                <section class="section">
                    <div class="section-title">${escapeHtml(section.title)}</div>
                    <div class="section-instruction">${escapeHtml(
                        section.instruction,
                    )}</div>
                    ${questionsHtml}
                </section>
            `;
        })
        .join("");

    const answerKey = params.answerKey?.length
        ? `
            <section class="answers">
                <div class="section-title">Answer Key</div>
                <ol>
                    ${params.answerKey
                        .map((answer) => {
                            const solution = answer.solution
                                ? ` - ${escapeHtml(answer.solution)}`
                                : "";
                            return `<li>${escapeHtml(
                                answer.answer,
                            )}${solution}</li>`;
                        })
                        .join("")}
                </ol>
            </section>
        `
        : "";

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <style>
                    body {
                        font-family: "Times New Roman", serif;
                        color: #111;
                        margin: 32px 40px 36px;
                        font-size: 12px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                    }
                    .school {
                        font-size: 17px;
                        font-weight: 700;
                    }
                    .title {
                        font-size: 13px;
                        margin-top: 2px;
                        font-weight: 600;
                    }
                    .meta {
                        font-size: 11px;
                        margin-top: 2px;
                    }
                    .meta-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0 8px;
                        font-size: 11px;
                    }
                    .instructions {
                        margin-bottom: 8px;
                        font-size: 11px;
                    }
                    .student {
                        display: flex;
                        justify-content: space-between;
                        gap: 12px;
                        font-size: 11px;
                        margin: 10px 0 16px;
                        flex-wrap: wrap;
                    }
                    .section {
                        margin-bottom: 16px;
                    }
                    .section-title {
                        font-size: 12px;
                        font-weight: 700;
                        margin-bottom: 4px;
                        text-align: center;
                    }
                    .section-instruction {
                        font-size: 11px;
                        margin-bottom: 6px;
                        text-align: left;
                    }
                    .question {
                        margin-bottom: 8px;
                    }
                    .question-text {
                        display: flex;
                        gap: 6px;
                        align-items: baseline;
                    }
                    .number {
                        font-weight: 700;
                    }
                    .marks {
                        margin-left: auto;
                        font-size: 10px;
                    }
                    .options {
                        margin: 6px 0 0 18px;
                        padding: 0;
                    }
                    .options li {
                        list-style: disc;
                        margin-left: 16px;
                    }
                    .answers {
                        page-break-before: always;
                        font-size: 11px;
                    }
                    .answers ol {
                        padding-left: 18px;
                    }
                </style>
            </head>
            <body>
                ${header}
                ${sectionsHtml}
                ${answerKey}
            </body>
        </html>
    `;
};
