export const extractJson = (text: string): unknown => {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
        throw new Error("Model output is not valid JSON");
    }
    const jsonText = text.slice(start, end + 1);
    return JSON.parse(jsonText);
};
