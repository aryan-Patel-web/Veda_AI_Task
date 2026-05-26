export function cleanPdfText(raw: string): string {
    return raw
        // Collapse 3+ newlines into 2
        .replace(/\n{3,}/g, "\n\n")
        // Remove lone page numbers like "- 4 -" or just "4" on its own line
        .replace(/^\s*[-–]?\s*\d+\s*[-–]?\s*$/gm, "")
        // Strip common header/footer noise (customize these patterns)
        .replace(/^(page\s+\d+|confidential|all rights reserved).*/gim, "")
        // Collapse multiple spaces into one
        .replace(/[ \t]{2,}/g, " ")
        // Trim each line
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .join("\n")
        .trim();
}
 
// ─── 2. Hard truncate by character count ──────────────────────────────────
// ~4 chars per token is a safe estimate for English text.
// gemini-flash has ~1M token context but you don't want to waste it all on raw text.
 
const CHARS_PER_TOKEN = 4;
 
export function truncateToTokenBudget(
    text: string,
    maxTokens = 12_000, // ~48k chars — plenty for exam generation
): string {
    const maxChars = maxTokens * CHARS_PER_TOKEN;
    if (text.length <= maxChars) return text;
 
    // Truncate and add a note so the model knows content was cut
    return (
        text.slice(0, maxChars) +
        "\n\n[Content truncated for length. Generate questions from the material above.]"
    );
}
 
// ─── 3. Semantic compression via a cheap LLM summarisation call ───────────
// Use this when you want the model to get a representative summary of
// the full document rather than just the first N pages.
 
import OpenAI from "openai";
 
const COMPRESS_SYSTEM_PROMPT = `You are a concise academic content extractor.
Given raw text from a textbook/study material, extract:
- Core concepts and definitions
- Key facts, formulas, and rules
- Important examples
 
Output plain text only. Be dense but complete. No bullet fluff.`;
 
export async function semanticCompressPdfText(
    rawText: string,
    client: OpenAI,
    model: string,
    targetTokens = 3_000,
): Promise<string> {
    const cleaned = cleanPdfText(rawText);
 
    // If already short enough, skip the LLM call entirely
    const estimatedTokens = Math.ceil(cleaned.length / CHARS_PER_TOKEN);
    if (estimatedTokens <= targetTokens) {
        return cleaned;
    }
 
    const response = await client.chat.completions.create({
        model,
        messages: [
            { role: "system", content: COMPRESS_SYSTEM_PROMPT },
            {
                role: "user",
                content: `Compress the following study material to ~${targetTokens} tokens:\n\n${
                    // Feed only first 80k chars to the summariser to keep it fast
                    cleaned.slice(0, 80_000)
                }`,
            },
        ],
        max_tokens: targetTokens,
    });
 
    return (
        response.choices[0]?.message?.content?.trim() ??
        truncateToTokenBudget(cleaned, targetTokens)
    );
}
 
// ─── 4. One-shot helper: pick the right strategy automatically ─────────────
 
export async function compressPdfText(
    rawText: string,
    client: OpenAI,
    model: string,
): Promise<string> {
    const cleaned = cleanPdfText(rawText);
    const estimatedTokens = Math.ceil(cleaned.length / CHARS_PER_TOKEN);
 
    if (estimatedTokens <= 12_000) {
        // Short enough — just clean and pass through
        return cleaned;
    }
 
    if (estimatedTokens <= 60_000) {
        // Medium — truncate to a safe budget
        console.log(
            `PDF text is ${estimatedTokens} tokens, truncating to 12k.`,
        );
        return truncateToTokenBudget(cleaned, 12_000);
    }
 
    // Large (like your 92-page PDF) — semantic summarisation
    console.log(
        `PDF text is ${estimatedTokens} tokens, running semantic compression.`,
    );
    return semanticCompressPdfText(cleaned, client, model, 4_000);
}