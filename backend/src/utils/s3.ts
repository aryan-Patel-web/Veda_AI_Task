import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const getS3Client = (): S3Client => {
    const region = process.env.AWS_REGION;
    if (!region) {
        throw new Error("AWS_REGION is not set");
    }
    return new S3Client({ region });
};

export const uploadPdfToS3 = async (
    buffer: Buffer,
    key: string,
): Promise<string> => {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) {
        throw new Error("AWS_S3_BUCKET is not set");
    }

    const client = getS3Client();
    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: "application/pdf",
        }),
    );

    const baseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;
    if (baseUrl) {
        return `${baseUrl}/${key}`;
    }

    const region = process.env.AWS_REGION;
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};
