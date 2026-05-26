import { z } from "zod";

export const resultPayloadSchema = z.object({
    sections: z
        .array(
            z.object({
                title: z.string().trim().min(1),
                instruction: z.string().trim().min(1),
                questions: z.array(
                    z.object({
                        number: z.number().int().min(1),
                        text: z.string().trim().min(1),
                        type: z.string().trim().min(1),
                        difficulty: z.enum(["easy", "medium", "hard"]),
                        marks: z.number().min(0),
                        options: z.array(z.string().trim().min(1)).optional(),
                        answer: z.string().trim().min(1).optional(),
                        solution: z.string().trim().min(1).optional(),
                    }),
                ),
            }),
        )
        .min(1),
    answerKey: z
        .array(
            z.object({
                number: z.number().int().min(1),
                answer: z.string().trim().min(1),
                solution: z.string().trim().min(1).optional(),
            }),
        )
        .optional(),
});

export type ResultPayload = z.infer<typeof resultPayloadSchema>;

export const validateGeneratedQuestions = (
    payload: ResultPayload,
    breakdown: { type: string; count: number; marksPerQuestion: number }[],
    totalQuestions: number,
    totalMarks: number,
): void => {
    const allQuestions = payload.sections.flatMap((section) => section.questions);
    if (allQuestions.length !== totalQuestions) {
        throw new Error(
            "Generated question count does not match totalQuestions",
        );
    }

    const markSum = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    if (markSum !== totalMarks) {
        throw new Error("Generated marks do not match totalMarks");
    }

    const typeCount = new Map<string, number>();
    const typeMarks = new Map<string, number>();
    for (const question of allQuestions) {
        typeCount.set(question.type, (typeCount.get(question.type) ?? 0) + 1);
        typeMarks.set(question.type, question.marks);
    }

    for (const item of breakdown) {
        const actualCount = typeCount.get(item.type) ?? 0;
        if (actualCount !== item.count) {
            throw new Error(`Question count mismatch for type ${item.type}`);
        }
        const expectedMarks = item.marksPerQuestion;
        const actualMarks = typeMarks.get(item.type);
        if (actualMarks !== expectedMarks) {
            throw new Error(`Marks mismatch for type ${item.type}`);
        }
    }
};
