declare module "pdf-parse" {
    const pdfParse: (data: Buffer | Uint8Array) => Promise<{ text: string }>;
    export default pdfParse;
}
