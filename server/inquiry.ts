import type { Express, Request, Response } from "express";
import nodemailer from "nodemailer";
import https from "https";
import querystring from "querystring";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

function postFormSubmit(
    token: string,
    fields: Record<string, string>,
    timeoutMs = 12_000
): Promise<{ status: number; body: string }> {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify(fields);

        const req = https.request(
            {
                method: "POST",
                hostname: "formsubmit.co",
                path: `/ajax/${encodeURIComponent(token)}`,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Content-Length": Buffer.byteLength(postData),
                },
            },
            (res) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    resolve({ status: res.statusCode || 0, body: data });
                });
            }
        );

        req.on("error", reject);

        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error(`FormSubmit request timed out after ${timeoutMs}ms`));
        });

        req.write(postData);
        req.end();
    });
}

export function registerInquiryRoute(app: Express) {
    app.post("/api/inquiry", async (req: Request, res: Response) => {
        const startedAt = Date.now();

        try {
            const { name, email, message, listingId } = (req.body || {}) as InquiryBody;

            if (!email || !message) {
                return res.status(400).send("Missing email or message");
            }

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            const plainText = [
                `Name: ${name || "(not provided)"}`,
                `Email: ${email}`,
                listingId ? `Listing: ${listingId}` : "",
                "",
                "Message:",
                message,
            ]
                .filter(Boolean)
                .join("\n");

            // =========================================================
            // 1) Preferred: FormSubmit (what worked for you before)
            // =========================================================
            const formsubmitToken = String(process.env.FORMSUBMIT_TOKEN || "").trim();

            if (formsubmitToken) {
                const fields: Record<string, string> = {
                    name: name || "",
                    email,
                    message,
                    listingId: listingId || "",
                    _subject: subject,
                    _replyto: email,
                    _template: "table",
                };

                const r = await postFormSubmit(formsubmitToken, fields, 12_000);

                if (r.status >= 200 && r.status < 300) {
                    return res.status(200).json({ ok: true, provider: "formsubmit" });
                }

                console.error("[inquiry] FormSubmit failed:", {
                    status: r.status,
                    body: (r.body || "").slice(0, 800),
                });

                return res.status(500).send("Failed to send email");
            }

            // =========================================================
            // 2) Fallback: SMTP (only if you want it)
            // =========================================================
            const host = String(process.env.SMTP_HOST || "").trim();
            const port = Number(process.env.SMTP_PORT || "587");
            const user = String(process.env.SMTP_USER || "").trim();
            const pass = String(process.env.SMTP_PASS || "").trim();
            const to = String(process.env.INQUIRY_TO || user).trim();

            if (!host || !user || !pass || !to) {
                return res
                    .status(500)
                    .send("Email not configured: set FORMSUBMIT_TOKEN (recommended) or SMTP_HOST/SMTP_USER/SMTP_PASS/INQUIRY_TO");
            }

            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
                connectionTimeout: 10_000,
                greetingTimeout: 10_000,
                socketTimeout: 12_000,
            });

            await transporter.sendMail({
                from: `"La Maison Website" <${user}>`,
                to,
                replyTo: email,
                subject,
                text: plainText,
            });

            return res.status(200).json({ ok: true, provider: "smtp" });
        } catch (e: any) {
            console.error("[inquiry] Failed:", e, "ms:", Date.now() - startedAt);
            return res.status(500).send("Failed to send email");
        }
    });
}
