export type AssignmentPromptInput = {
    title: string;
    subjectName: string;
    gradeLevel: string;
    schoolName?: string;
    dueDate: string;
    difficulty: "easy" | "medium" | "hard" | "mixed";
    questionBreakdown: {
        type: string;
        count: number;
        marksPerQuestion: number;
    }[];
    totalQuestions: number;
    totalMarks: number;
    additionalInstructions?: string;
    pdfText?: string;
};

export const ASSIGNMENT_SYSTEM_PROMPT = `You are an expert teacher creating a full exam paper with answers.\n\nRules:\n- Output ONLY valid JSON. No markdown, no code fences, no extra text.\n- Follow the provided question breakdown exactly (type, count, marks per question).\n- Use the requested difficulty distribution; if difficulty is \"mixed\", mix all three evenly.\n- Ensure totals match exactly: totalQuestions and totalMarks.\n- Provide clear, syllabus-aligned questions.\n- Include an answer for each question; add solutions for non-MCQ where helpful.\n\nOutput JSON schema:\n{\n  \"sections\": [\n    {\n      \"title\": \"Section A\",\n      \"instruction\": \"Answer all questions\",\n      \"questions\": [\n        {\n          \"number\": 1,\n          \"text\": \"...\",\n          \"type\": \"mcq|short|long|numerical|diagram|...\",\n          \"difficulty\": \"easy|medium|hard\",\n          \"marks\": 1,\n          \"options\": [\"A\", \"B\", \"C\", \"D\"],\n          \"answer\": \"B\",\n          \"solution\": \"...\"\n        }\n      ]\n    }\n  ],\n  \"answerKey\": [\n    {\n      \"number\": 1,\n      \"answer\": \"B\",\n      \"solution\": \"...\"\n    }\n  ]\n}`;

export const buildAssignmentUserPrompt = (
    input: AssignmentPromptInput,
): string => {
    return `Generate an exam paper based on the assignment input below.\n\nAssignment Input (JSON):\n${JSON.stringify(
        input,
        null,
        2,
    )}\n\nNotes:\n- Use questionBreakdown to allocate question types, counts, and marks per question.\n- Use additionalInstructions and pdfText as extra constraints if present.\n- Keep numbering continuous across sections starting at 1.`;
};
