import { createNodeRedisClient, Queue } from "bullmq";
import dotenv from "dotenv";
import { createClient } from 'redis';

dotenv.config();

export const assignmentQueueName = "assignment";
export const emailQueueName = "email";

const rawClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});


export const assignmentQueueConnection = createNodeRedisClient(rawClient as any);

export const assignmentQueue = new Queue(assignmentQueueName, {
    connection: assignmentQueueConnection,
});

export const emailQueue = new Queue(emailQueueName, {
    connection: assignmentQueueConnection,
});
