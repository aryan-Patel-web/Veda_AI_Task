import { Worker } from "bullmq";
import dotenv from "dotenv";
import {
    assignmentQueueConnection,
    emailQueueName,
} from "../queues/assignment.queue.js";
import {
    sendAssignmentFailedEmail,
    sendAssignmentReadyEmail,
} from "../utils/emailFn.js";

dotenv.config();

const startWorker = () => {
    const worker = new Worker(
        emailQueueName,
        async (job) => {
            console.log("Processing email job with data:", job.data);

            const frontendBase = process.env.FRONTEND_ORIGIN;
            if (!frontendBase) {
                throw new Error("FRONTEND_URL is not set");
            }

            const base = frontendBase.replace(/\/$/, "");

            if (job.name === "assignment-failed") {
                const {
                    to,
                    assignmentTitle,
                    userName,
                    assignmentId,
                    failureReason,
                } = job.data || {};
                if (!to || !assignmentTitle || !assignmentId) {
                    throw new Error(
                        "to, assignmentTitle, and assignmentId are required",
                    );
                }

                const assignmentUrl = `${base}/assignments/${encodeURIComponent(
                    assignmentId,
                )}`;

                await sendAssignmentFailedEmail({
                    to,
                    assignmentTitle,
                    userName,
                    assignmentUrl,
                    failureReason,
                });

                console.log("Failure email sent successfully to", to);
                return;
            }

            const {
                to,
                assignmentTitle,
                pdfUrl,
                userName,
                assignmentId,
                requestSummary,
                scoreSummary,
            } = job.data || {};
            if (!to || !assignmentTitle || !pdfUrl || !assignmentId) {
                throw new Error(
                    "to, assignmentTitle, pdfUrl, and assignmentId are required",
                );
            }

            const resultUrl = `${base}/assignments/${encodeURIComponent(
                assignmentId,
            )}/result`;

            console.log("Generated result URL:", resultUrl);

            await sendAssignmentReadyEmail({
                to,
                assignmentTitle,
                pdfUrl,
                userName,
                resultUrl,
                requestSummary,
                scoreSummary,
            });

            console.log("Email sent successfully to", to);
        },
        { connection: assignmentQueueConnection },
    );

    worker.on("failed", (job, error) => {
        console.error("Email job failed", { jobId: job?.id, error });
    });
};

startWorker();
