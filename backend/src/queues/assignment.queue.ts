import { Queue, type ConnectionOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const assignmentQueueName = "assignment";
export const emailQueueName = "email";

// BullMQ v5 bundles its own ioredis internally.
// Passing a plain ConnectionOptions object avoids the dual-ioredis type conflict.
// BullMQ will create the Redis connection using its own bundled version.
function getRedisConnection(): ConnectionOptions {
    const url = process.env.REDIS_URL ?? "redis://localhost:6379";
    try {
        const parsed = new URL(url);
        const isTLS = url.startsWith("rediss://");
        return {
            host: parsed.hostname,
            port: parseInt(parsed.port || (isTLS ? "6380" : "6379"), 10),
            ...(parsed.password ? { password: decodeURIComponent(parsed.password) } : {}),
            ...(parsed.username && parsed.username !== "default" ? { username: parsed.username } : {}),
            ...(isTLS ? { tls: {} } : {}),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        } as ConnectionOptions;
    } catch {
        // fallback for plain redis://host:port
        return {
            host: "localhost",
            port: 6379,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        } as ConnectionOptions;
    }
}

export const assignmentQueueConnection: ConnectionOptions = getRedisConnection();

export const assignmentQueue = new Queue(assignmentQueueName, {
    connection: assignmentQueueConnection,
});

assignmentQueue.on("error", (err: Error) => {
    console.error("❌ Assignment queue error:", err.message);
});

export const emailQueue = new Queue(emailQueueName, {
    connection: assignmentQueueConnection,
});

emailQueue.on("error", (err: Error) => {
    console.error("❌ Email queue error:", err.message);
});

console.log("✅ BullMQ queues initialised");