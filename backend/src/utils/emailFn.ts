// // import nodemailer from "nodemailer";

// // type AssignmentEmailPayload = {
// //     to: string;
// //     userName?: string;
// //     assignmentTitle: string;
// //     pdfUrl: string;
// //     resultUrl: string;
// //     requestSummary?: string;
// //     scoreSummary?: string;
// // };



// // type VerificationEmailPayload = {
// //     to: string;
// //     userName?: string;
// //     code: string;
// // };

// // type AssignmentFailedEmailPayload = {
// //     to: string;
// //     userName?: string;
// //     assignmentTitle: string;
// //     assignmentUrl: string;
// //     failureReason?: string;
// // };

// // const getTransporter = () => {
// //     const host = process.env.SMTP_HOST;
// //     const port = Number(process.env.SMTP_PORT ?? 587);
// //     const user = process.env.SMTP_USER;
// //     const pass = process.env.SMTP_PASS;

// //     if (!host || !user || !pass) {
// //         throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required");
// //     }

// //     return nodemailer.createTransport({
// //         host,
// //         port,
// //         secure: port === 465,
// //         auth: { user, pass },
// //     });
// // };

// // const buildAssignmentEmailHtml = (payload: AssignmentEmailPayload): string => {
// //     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
// //     const summary = payload.requestSummary
// //         ? `<p style="margin: 6px 0 0; color: #334155;">${payload.requestSummary}</p>`
// //         : "";
// //     const scoreLine = payload.scoreSummary
// //         ? `<p style="margin: 8px 0 0; color: #0f172a; font-weight: 600;">${payload.scoreSummary}</p>`
// //         : "";
// //     return `
// //         <div style="background: #ededed; padding: 24px;">
// //             <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
// //                 <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
// //                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
// //                     <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">Your assignment result is ready</h1>
// //                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} We completed <strong>${payload.assignmentTitle}</strong>.</p>
// //                 </div>
// //                 <div style="padding: 22px 24px;">
// //                     <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
// //                         <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">
// //                             Open the result page to review the breakdown, then download the PDF anytime.
// //                         </p>
// //                         ${summary}
// //                         ${scoreLine}
// //                     </div>
// //                     <div style="margin: 18px 0 6px; display: flex; flex-wrap: wrap; gap: 10px;">
// //                         <a href="${payload.resultUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Result</a>
// //                         <a href="${payload.pdfUrl}" style="background: #ffffff; color: #111111; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #e5e7eb;">Download PDF</a>
// //                     </div>
// //                     <div style="margin-top: 16px; padding: 14px 16px; background: #f3f3f3; border-radius: 14px; border: 1px solid #e5e7eb;">
// //                         <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px;">Quick Links</div>
// //                         <p style="margin: 8px 0 0; font-size: 13px; color: #374151; word-break: break-word;">Result page: ${payload.resultUrl}</p>
// //                         <p style="margin: 6px 0 0; font-size: 13px; color: #374151; word-break: break-word;">PDF link: ${payload.pdfUrl}</p>
// //                     </div>
// //                     <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">
// //                         If you did not request this, you can ignore this email.
// //                     </p>
// //                 </div>
// //             </div>
// //         </div>
// // 	`;
// // };

// // export const sendAssignmentReadyEmail = async (
// //     payload: AssignmentEmailPayload,
// // ): Promise<void> => {
// //     const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
// //     if (!from) {
// //         throw new Error("SMTP_FROM is not set");
// //     }

// //     const transporter = getTransporter();
// //     const html = buildAssignmentEmailHtml(payload);
// //     const text = `Veda AI: Your assignment result is ready for "${payload.assignmentTitle}". Result: ${payload.resultUrl}. PDF: ${payload.pdfUrl}`;

// //     await transporter.sendMail({
// //         from,
// //         to: payload.to,
// //         subject: "Veda AI: Your assignment result is ready",
// //         text,
// //         html,
// //     });
// // };

// // const buildAssignmentFailedEmailHtml = (
// //     payload: AssignmentFailedEmailPayload,
// // ): string => {
// //     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
// //     const reason = payload.failureReason
// //         ? `<p style="margin: 10px 0 0; color: #b45309;">Reason: ${payload.failureReason}</p>`
// //         : "";
// //     return `
// //         <div style="background: #ededed; padding: 24px;">
// //             <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
// //                 <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
// //                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
// //                     <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">We could not generate your assignment</h1>
// //                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} The assignment <strong>${payload.assignmentTitle}</strong> failed to generate.</p>
// //                 </div>
// //                 <div style="padding: 22px 24px;">
// //                     <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
// //                         <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">You can open the assignment and try again after reviewing the details.</p>
// //                         ${reason}
// //                     </div>
// //                     <div style="margin: 18px 0 6px; display: flex; flex-wrap: wrap; gap: 10px;">
// //                         <a href="${payload.assignmentUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Assignment</a>
// //                     </div>
// //                     <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
// //                 </div>
// //             </div>
// //         </div>
// //     `;
// // };

// // export const sendAssignmentFailedEmail = async (
// //     payload: AssignmentFailedEmailPayload,
// // ): Promise<void> => {
// //     const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
// //     if (!from) {
// //         throw new Error("SMTP_FROM is not set");
// //     }

// //     const transporter = getTransporter();
// //     const html = buildAssignmentFailedEmailHtml(payload);
// //     const text = `Veda AI: We could not generate your assignment "${payload.assignmentTitle}". View: ${payload.assignmentUrl}.`;

// //     await transporter.sendMail({
// //         from,
// //         to: payload.to,
// //         subject: "Veda AI: Assignment generation failed",
// //         text,
// //         html,
// //     });
// // };

// // const buildVerificationEmailHtml = (
// //     payload: VerificationEmailPayload,
// // ): string => {
// //     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
// //     return `
// //         <div style="background: #ededed; padding: 24px;">
// //             <div style="max-width: 560px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
// //                 <div style="background: #111111; color: #ffffff; padding: 20px 22px;">
// //                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
// //                     <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 700;">Verify your email</h1>
// //                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} Use the code below to verify your account.</p>
// //                 </div>
// //                 <div style="padding: 22px;">
// //                     <div style="border: 1px dashed #e5e7eb; border-radius: 14px; padding: 16px; text-align: center; background: #f7f7f7;">
// //                         <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; color: #111827;">${payload.code}</div>
// //                         <div style="margin-top: 6px; font-size: 12px; color: #6b7280;">This code expires in 10 minutes.</div>
// //                     </div>
// //                     <p style="margin: 14px 0 0; font-size: 12px; color: #6b7280;">If you did not create an account, you can ignore this email.</p>
// //                 </div>
// //             </div>
// //         </div>
// //     `;
// // };

// // export const sendVerificationEmail = async (
// //     payload: VerificationEmailPayload,
// // ): Promise<void> => {
// //     const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
// //     if (!from) {
// //         throw new Error("SMTP_FROM is not set");
// //     }

// //     const transporter = getTransporter();
// //     const html = buildVerificationEmailHtml(payload);
// //     const text = `Veda AI verification code: ${payload.code}. This code expires in 10 minutes.`;

// //     await transporter.sendMail({
// //         from,
// //         to: payload.to,
// //         subject: "Veda AI: Verify your email",
// //         text,
// //         html,
// //     });
// // };


// import nodemailer from "nodemailer";

// type AssignmentEmailPayload = {
//     to: string;
//     userName?: string;
//     assignmentTitle: string;
//     pdfUrl: string;
//     resultUrl: string;
//     requestSummary?: string;
//     scoreSummary?: string;
// };

// type VerificationEmailPayload = {
//     to: string;
//     userName?: string;
//     code: string;
// };

// type AssignmentFailedEmailPayload = {
//     to: string;
//     userName?: string;
//     assignmentTitle: string;
//     assignmentUrl: string;
//     failureReason?: string;
// };

// // ─── Resend HTTP API sender (works on Render free tier, no SMTP port issues) ───
// const sendViaResendApi = async (payload: {
//     to: string;
//     subject: string;
//     html: string;
//     text: string;
// }): Promise<void> => {
//     const apiKey = process.env.RESEND_API_KEY ?? process.env.SMTP_PASS;
//     const from = process.env.SMTP_FROM ?? "onboarding@resend.dev";

//     if (!apiKey) {
//         throw new Error("RESEND_API_KEY (or SMTP_PASS) is not set");
//     }

//     const res = await fetch("https://api.resend.com/emails", {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${apiKey}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             from,
//             to: payload.to,
//             subject: payload.subject,
//             html: payload.html,
//             text: payload.text,
//         }),
//     });

//     if (!res.ok) {
//         const body = await res.text();
//         throw new Error(`Resend API error ${res.status}: ${body}`);
//     }
// };

// // ─── Nodemailer SMTP fallback (for local dev with Gmail / custom SMTP) ──────
// const sendViaSmtp = async (payload: {
//     to: string;
//     subject: string;
//     html: string;
//     text: string;
// }): Promise<void> => {
//     const host = process.env.SMTP_HOST;
//     const port = Number(process.env.SMTP_PORT ?? 587);
//     const user = process.env.SMTP_USER;
//     const pass = process.env.SMTP_PASS;
//     const from = process.env.SMTP_FROM ?? user;

//     if (!host || !user || !pass || !from) {
//         throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM are required");
//     }

//     const transporter = nodemailer.createTransport({
//         host,
//         port,
//         secure: port === 465,
//         auth: { user, pass },
//     });

//     await transporter.sendMail({
//         from,
//         to: payload.to,
//         subject: payload.subject,
//         text: payload.text,
//         html: payload.html,
//     });
// };

// // ─── Unified send function: Resend API first, SMTP fallback ─────────────────
// const sendEmail = async (payload: {
//     to: string;
//     subject: string;
//     html: string;
//     text: string;
// }): Promise<void> => {
//     const useResend =
//         process.env.RESEND_API_KEY ||
//         process.env.SMTP_HOST === "smtp.resend.com" ||
//         process.env.SMTP_USER === "resend";

//     if (useResend) {
//         await sendViaResendApi(payload);
//     } else {
//         await sendViaSmtp(payload);
//     }
// };

// // ─── Email HTML builders ─────────────────────────────────────────────────────

// const buildAssignmentEmailHtml = (payload: AssignmentEmailPayload): string => {
//     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
//     const summary = payload.requestSummary
//         ? `<p style="margin: 6px 0 0; color: #334155;">${payload.requestSummary}</p>`
//         : "";
//     const scoreLine = payload.scoreSummary
//         ? `<p style="margin: 8px 0 0; color: #0f172a; font-weight: 600;">${payload.scoreSummary}</p>`
//         : "";
//     return `
//         <div style="background: #ededed; padding: 24px;">
//             <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
//                 <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
//                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
//                     <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">Your assignment result is ready</h1>
//                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} We completed <strong>${payload.assignmentTitle}</strong>.</p>
//                 </div>
//                 <div style="padding: 22px 24px;">
//                     <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
//                         <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">
//                             Open the result page to review the breakdown, then download the PDF anytime.
//                         </p>
//                         ${summary}
//                         ${scoreLine}
//                     </div>
//                     <div style="margin: 18px 0 6px;">
//                         <a href="${payload.resultUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316; margin-right: 10px;">View Result</a>
//                         <a href="${payload.pdfUrl}" style="background: #ffffff; color: #111111; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #e5e7eb;">Download PDF</a>
//                     </div>
//                     <div style="margin-top: 16px; padding: 14px 16px; background: #f3f3f3; border-radius: 14px; border: 1px solid #e5e7eb;">
//                         <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px;">Quick Links</div>
//                         <p style="margin: 8px 0 0; font-size: 13px; color: #374151; word-break: break-word;">Result: ${payload.resultUrl}</p>
//                         <p style="margin: 6px 0 0; font-size: 13px; color: #374151; word-break: break-word;">PDF: ${payload.pdfUrl}</p>
//                     </div>
//                     <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
//                 </div>
//             </div>
//         </div>
//     `;
// };

// const buildAssignmentFailedEmailHtml = (
//     payload: AssignmentFailedEmailPayload,
// ): string => {
//     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
//     const reason = payload.failureReason
//         ? `<p style="margin: 10px 0 0; color: #b45309;">Reason: ${payload.failureReason}</p>`
//         : "";
//     return `
//         <div style="background: #ededed; padding: 24px;">
//             <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden;">
//                 <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
//                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
//                     <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">We could not generate your assignment</h1>
//                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} The assignment <strong>${payload.assignmentTitle}</strong> failed to generate.</p>
//                 </div>
//                 <div style="padding: 22px 24px;">
//                     <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
//                         <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">You can open the assignment and try again after reviewing the details.</p>
//                         ${reason}
//                     </div>
//                     <div style="margin: 18px 0 6px;">
//                         <a href="${payload.assignmentUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Assignment</a>
//                     </div>
//                     <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
//                 </div>
//             </div>
//         </div>
//     `;
// };

// const buildVerificationEmailHtml = (
//     payload: VerificationEmailPayload,
// ): string => {
//     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
//     return `
//         <div style="background: #ededed; padding: 24px;">
//             <div style="max-width: 560px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
//                 <div style="background: #111111; color: #ffffff; padding: 20px 22px;">
//                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
//                     <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 700;">Verify your email</h1>
//                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} Use the code below to verify your account.</p>
//                 </div>
//                 <div style="padding: 22px;">
//                     <div style="border: 1px dashed #e5e7eb; border-radius: 14px; padding: 16px; text-align: center; background: #f7f7f7;">
//                         <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; color: #111827;">${payload.code}</div>
//                         <div style="margin-top: 6px; font-size: 12px; color: #6b7280;">This code expires in 10 minutes.</div>
//                     </div>
//                     <p style="margin: 14px 0 0; font-size: 12px; color: #6b7280;">If you did not create an account, you can ignore this email.</p>
//                 </div>
//             </div>
//         </div>
//     `;
// };

// // ─── Public API ──────────────────────────────────────────────────────────────

// export const sendAssignmentReadyEmail = async (
//     payload: AssignmentEmailPayload,
// ): Promise<void> => {
//     const html = buildAssignmentEmailHtml(payload);
//     const text = `Veda AI: Your assignment result is ready for "${payload.assignmentTitle}". Result: ${payload.resultUrl}. PDF: ${payload.pdfUrl}`;
//     await sendEmail({ to: payload.to, subject: "Veda AI: Your assignment result is ready", html, text });
// };

// export const sendAssignmentFailedEmail = async (
//     payload: AssignmentFailedEmailPayload,
// ): Promise<void> => {
//     const html = buildAssignmentFailedEmailHtml(payload);
//     const text = `Veda AI: We could not generate your assignment "${payload.assignmentTitle}". View: ${payload.assignmentUrl}.`;
//     await sendEmail({ to: payload.to, subject: "Veda AI: Assignment generation failed", html, text });
// };

// export const sendVerificationEmail = async (
//     payload: VerificationEmailPayload,
// ): Promise<void> => {
//     const html = buildVerificationEmailHtml(payload);
//     const text = `Veda AI verification code: ${payload.code}. This code expires in 10 minutes.`;
//     await sendEmail({ to: payload.to, subject: "Veda AI: Verify your email", html, text });
// };



// import nodemailer from "nodemailer";

// type AssignmentEmailPayload = {
//     to: string;
//     userName?: string;
//     assignmentTitle: string;
//     pdfUrl: string;
//     resultUrl: string;
//     requestSummary?: string;
//     scoreSummary?: string;
// };



// type VerificationEmailPayload = {
//     to: string;
//     userName?: string;
//     code: string;
// };

// type AssignmentFailedEmailPayload = {
//     to: string;
//     userName?: string;
//     assignmentTitle: string;
//     assignmentUrl: string;
//     failureReason?: string;
// };

// const getTransporter = () => {
//     const host = process.env.SMTP_HOST;
//     const port = Number(process.env.SMTP_PORT ?? 587);
//     const user = process.env.SMTP_USER;
//     const pass = process.env.SMTP_PASS;

//     if (!host || !user || !pass) {
//         throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required");
//     }

//     return nodemailer.createTransport({
//         host,
//         port,
//         secure: port === 465,
//         auth: { user, pass },
//     });
// };

// const buildAssignmentEmailHtml = (payload: AssignmentEmailPayload): string => {
//     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
//     const summary = payload.requestSummary
//         ? `<p style="margin: 6px 0 0; color: #334155;">${payload.requestSummary}</p>`
//         : "";
//     const scoreLine = payload.scoreSummary
//         ? `<p style="margin: 8px 0 0; color: #0f172a; font-weight: 600;">${payload.scoreSummary}</p>`
//         : "";
//     return `
//         <div style="background: #ededed; padding: 24px;">
//             <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
//                 <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
//                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
//                     <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">Your assignment result is ready</h1>
//                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} We completed <strong>${payload.assignmentTitle}</strong>.</p>
//                 </div>
//                 <div style="padding: 22px 24px;">
//                     <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
//                         <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">
//                             Open the result page to review the breakdown, then download the PDF anytime.
//                         </p>
//                         ${summary}
//                         ${scoreLine}
//                     </div>
//                     <div style="margin: 18px 0 6px; display: flex; flex-wrap: wrap; gap: 10px;">
//                         <a href="${payload.resultUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Result</a>
//                         <a href="${payload.pdfUrl}" style="background: #ffffff; color: #111111; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #e5e7eb;">Download PDF</a>
//                     </div>
//                     <div style="margin-top: 16px; padding: 14px 16px; background: #f3f3f3; border-radius: 14px; border: 1px solid #e5e7eb;">
//                         <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px;">Quick Links</div>
//                         <p style="margin: 8px 0 0; font-size: 13px; color: #374151; word-break: break-word;">Result page: ${payload.resultUrl}</p>
//                         <p style="margin: 6px 0 0; font-size: 13px; color: #374151; word-break: break-word;">PDF link: ${payload.pdfUrl}</p>
//                     </div>
//                     <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">
//                         If you did not request this, you can ignore this email.
//                     </p>
//                 </div>
//             </div>
//         </div>
// 	`;
// };

// export const sendAssignmentReadyEmail = async (
//     payload: AssignmentEmailPayload,
// ): Promise<void> => {
//     const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
//     if (!from) {
//         throw new Error("SMTP_FROM is not set");
//     }

//     const transporter = getTransporter();
//     const html = buildAssignmentEmailHtml(payload);
//     const text = `Veda AI: Your assignment result is ready for "${payload.assignmentTitle}". Result: ${payload.resultUrl}. PDF: ${payload.pdfUrl}`;

//     await transporter.sendMail({
//         from,
//         to: payload.to,
//         subject: "Veda AI: Your assignment result is ready",
//         text,
//         html,
//     });
// };

// const buildAssignmentFailedEmailHtml = (
//     payload: AssignmentFailedEmailPayload,
// ): string => {
//     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
//     const reason = payload.failureReason
//         ? `<p style="margin: 10px 0 0; color: #b45309;">Reason: ${payload.failureReason}</p>`
//         : "";
//     return `
//         <div style="background: #ededed; padding: 24px;">
//             <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
//                 <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
//                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
//                     <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">We could not generate your assignment</h1>
//                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} The assignment <strong>${payload.assignmentTitle}</strong> failed to generate.</p>
//                 </div>
//                 <div style="padding: 22px 24px;">
//                     <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
//                         <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">You can open the assignment and try again after reviewing the details.</p>
//                         ${reason}
//                     </div>
//                     <div style="margin: 18px 0 6px; display: flex; flex-wrap: wrap; gap: 10px;">
//                         <a href="${payload.assignmentUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Assignment</a>
//                     </div>
//                     <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
//                 </div>
//             </div>
//         </div>
//     `;
// };

// export const sendAssignmentFailedEmail = async (
//     payload: AssignmentFailedEmailPayload,
// ): Promise<void> => {
//     const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
//     if (!from) {
//         throw new Error("SMTP_FROM is not set");
//     }

//     const transporter = getTransporter();
//     const html = buildAssignmentFailedEmailHtml(payload);
//     const text = `Veda AI: We could not generate your assignment "${payload.assignmentTitle}". View: ${payload.assignmentUrl}.`;

//     await transporter.sendMail({
//         from,
//         to: payload.to,
//         subject: "Veda AI: Assignment generation failed",
//         text,
//         html,
//     });
// };

// const buildVerificationEmailHtml = (
//     payload: VerificationEmailPayload,
// ): string => {
//     const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
//     return `
//         <div style="background: #ededed; padding: 24px;">
//             <div style="max-width: 560px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
//                 <div style="background: #111111; color: #ffffff; padding: 20px 22px;">
//                     <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
//                     <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 700;">Verify your email</h1>
//                     <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} Use the code below to verify your account.</p>
//                 </div>
//                 <div style="padding: 22px;">
//                     <div style="border: 1px dashed #e5e7eb; border-radius: 14px; padding: 16px; text-align: center; background: #f7f7f7;">
//                         <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; color: #111827;">${payload.code}</div>
//                         <div style="margin-top: 6px; font-size: 12px; color: #6b7280;">This code expires in 10 minutes.</div>
//                     </div>
//                     <p style="margin: 14px 0 0; font-size: 12px; color: #6b7280;">If you did not create an account, you can ignore this email.</p>
//                 </div>
//             </div>
//         </div>
//     `;
// };

// export const sendVerificationEmail = async (
//     payload: VerificationEmailPayload,
// ): Promise<void> => {
//     const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
//     if (!from) {
//         throw new Error("SMTP_FROM is not set");
//     }

//     const transporter = getTransporter();
//     const html = buildVerificationEmailHtml(payload);
//     const text = `Veda AI verification code: ${payload.code}. This code expires in 10 minutes.`;

//     await transporter.sendMail({
//         from,
//         to: payload.to,
//         subject: "Veda AI: Verify your email",
//         text,
//         html,
//     });
// };


import nodemailer from "nodemailer";

type AssignmentEmailPayload = {
    to: string;
    userName?: string;
    assignmentTitle: string;
    pdfUrl: string;
    resultUrl: string;
    requestSummary?: string;
    scoreSummary?: string;
};

type VerificationEmailPayload = {
    to: string;
    userName?: string;
    code: string;
};

type AssignmentFailedEmailPayload = {
    to: string;
    userName?: string;
    assignmentTitle: string;
    assignmentUrl: string;
    failureReason?: string;
};

// ─── Resend HTTP API sender (works on Render free tier, no SMTP port issues) ───
const sendViaResendApi = async (payload: {
    to: string;
    subject: string;
    html: string;
    text: string;
}): Promise<void> => {
    const apiKey = process.env.RESEND_API_KEY ?? process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM ?? "onboarding@resend.dev";

    if (!apiKey) {
        throw new Error("RESEND_API_KEY (or SMTP_PASS) is not set");
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Resend API error ${res.status}: ${body}`);
    }
};

// ─── Brevo HTTP API sender (works on Render free tier, port 443) ─────────────
const sendViaBrevoApi = async (payload: {
    to: string;
    subject: string;
    html: string;
    text: string;
}): Promise<void> => {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.SMTP_FROM?.match(/<(.+)>/)?.[1] ?? process.env.SMTP_FROM ?? "noreply@vedaai.com";
    const fromName = process.env.SMTP_FROM?.match(/^(.+?)\s*</)?.[1]?.trim() ?? "VedaAI";

    if (!apiKey) throw new Error("BREVO_API_KEY is not set");

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sender: { name: fromName, email: fromEmail },
            to: [{ email: payload.to }],
            subject: payload.subject,
            htmlContent: payload.html,
            textContent: payload.text,
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Brevo API error ${res.status}: ${body}`);
    }
};

// ─── Nodemailer SMTP fallback (for local dev with Gmail / custom SMTP) ──────
const sendViaSmtp = async (payload: {
    to: string;
    subject: string;
    html: string;
    text: string;
}): Promise<void> => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM ?? user;

    if (!host || !user || !pass || !from) {
        throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM are required");
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    await transporter.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
    });
};

// ─── Unified send function: Resend API first, SMTP fallback ─────────────────
const sendEmail = async (payload: {
    to: string;
    subject: string;
    html: string;
    text: string;
}): Promise<void> => {
    const useBrevo = !!process.env.BREVO_API_KEY;
    const useResend =
        process.env.RESEND_API_KEY ||
        process.env.SMTP_HOST === "smtp.resend.com" ||
        process.env.SMTP_USER === "resend";

    if (useBrevo) {
        await sendViaBrevoApi(payload);
    } else if (useResend) {
        await sendViaResendApi(payload);
    } else {
        await sendViaSmtp(payload);
    }
};

// ─── Email HTML builders ─────────────────────────────────────────────────────

const buildAssignmentEmailHtml = (payload: AssignmentEmailPayload): string => {
    const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
    const summary = payload.requestSummary
        ? `<p style="margin: 6px 0 0; color: #334155;">${payload.requestSummary}</p>`
        : "";
    const scoreLine = payload.scoreSummary
        ? `<p style="margin: 8px 0 0; color: #0f172a; font-weight: 600;">${payload.scoreSummary}</p>`
        : "";
    return `
        <div style="background: #ededed; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
                <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
                    <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">Your assignment result is ready</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} We completed <strong>${payload.assignmentTitle}</strong>.</p>
                </div>
                <div style="padding: 22px 24px;">
                    <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">
                            Open the result page to review the breakdown, then download the PDF anytime.
                        </p>
                        ${summary}
                        ${scoreLine}
                    </div>
                    <div style="margin: 18px 0 6px;">
                        <a href="${payload.resultUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316; margin-right: 10px;">View Result</a>
                        <a href="${payload.pdfUrl}" style="background: #ffffff; color: #111111; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #e5e7eb;">Download PDF</a>
                    </div>
                    <div style="margin-top: 16px; padding: 14px 16px; background: #f3f3f3; border-radius: 14px; border: 1px solid #e5e7eb;">
                        <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.2px;">Quick Links</div>
                        <p style="margin: 8px 0 0; font-size: 13px; color: #374151; word-break: break-word;">Result: ${payload.resultUrl}</p>
                        <p style="margin: 6px 0 0; font-size: 13px; color: #374151; word-break: break-word;">PDF: ${payload.pdfUrl}</p>
                    </div>
                    <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
                </div>
            </div>
        </div>
    `;
};

const buildAssignmentFailedEmailHtml = (
    payload: AssignmentFailedEmailPayload,
): string => {
    const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
    const reason = payload.failureReason
        ? `<p style="margin: 10px 0 0; color: #b45309;">Reason: ${payload.failureReason}</p>`
        : "";
    return `
        <div style="background: #ededed; padding: 24px;">
            <div style="max-width: 640px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden;">
                <div style="background: #111111; color: #ffffff; padding: 22px 24px;">
                    <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">We could not generate your assignment</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} The assignment <strong>${payload.assignmentTitle}</strong> failed to generate.</p>
                </div>
                <div style="padding: 22px 24px;">
                    <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background: #f7f7f7;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #374151;">You can open the assignment and try again after reviewing the details.</p>
                        ${reason}
                    </div>
                    <div style="margin: 18px 0 6px;">
                        <a href="${payload.assignmentUrl}" style="background: #111111; color: #ffffff; padding: 12px 18px; text-decoration: none; border-radius: 999px; display: inline-block; font-weight: 600; border: 1px solid #f97316;">View Assignment</a>
                    </div>
                    <p style="margin: 18px 0 0; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
                </div>
            </div>
        </div>
    `;
};

const buildVerificationEmailHtml = (
    payload: VerificationEmailPayload,
): string => {
    const greeting = payload.userName ? `Hi ${payload.userName},` : "Hi there,";
    return `
        <div style="background: #ededed; padding: 24px;">
            <div style="max-width: 560px; margin: 0 auto; font-family: 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(0,0,0,0.08);">
                <div style="background: #111111; color: #ffffff; padding: 20px 22px;">
                    <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Veda AI</div>
                    <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 700;">Verify your email</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">${greeting} Use the code below to verify your account.</p>
                </div>
                <div style="padding: 22px;">
                    <div style="border: 1px dashed #e5e7eb; border-radius: 14px; padding: 16px; text-align: center; background: #f7f7f7;">
                        <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; color: #111827;">${payload.code}</div>
                        <div style="margin-top: 6px; font-size: 12px; color: #6b7280;">This code expires in 10 minutes.</div>
                    </div>
                    <p style="margin: 14px 0 0; font-size: 12px; color: #6b7280;">If you did not create an account, you can ignore this email.</p>
                </div>
            </div>
        </div>
    `;
};

// ─── Public API ──────────────────────────────────────────────────────────────

export const sendAssignmentReadyEmail = async (
    payload: AssignmentEmailPayload,
): Promise<void> => {
    const html = buildAssignmentEmailHtml(payload);
    const text = `Veda AI: Your assignment result is ready for "${payload.assignmentTitle}". Result: ${payload.resultUrl}. PDF: ${payload.pdfUrl}`;
    await sendEmail({ to: payload.to, subject: "Veda AI: Your assignment result is ready", html, text });
};

export const sendAssignmentFailedEmail = async (
    payload: AssignmentFailedEmailPayload,
): Promise<void> => {
    const html = buildAssignmentFailedEmailHtml(payload);
    const text = `Veda AI: We could not generate your assignment "${payload.assignmentTitle}". View: ${payload.assignmentUrl}.`;
    await sendEmail({ to: payload.to, subject: "Veda AI: Assignment generation failed", html, text });
};

export const sendVerificationEmail = async (
    payload: VerificationEmailPayload,
): Promise<void> => {
    const html = buildVerificationEmailHtml(payload);
    const text = `Veda AI verification code: ${payload.code}. This code expires in 10 minutes.`;
    await sendEmail({ to: payload.to, subject: "Veda AI: Verify your email", html, text });
};