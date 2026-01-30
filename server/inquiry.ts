import type { Express, Request, Response } from "express";
import https from "https";
import querystring from "querystring";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

type FormSubmitResult = {
    status: number;
    body: string;
};

function isValidEmail(email: string) {
    // “Good enough” validation (not perfect RFC, but practical)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function clamp(s: unknown, max = 4000) {
    const str = String(s ?? "");
    return str.length > max ? str.slice(0, max) : str;
}

/**
 * Calls https://formsubmit.co/ajax/<token>
 * Returns status + raw body (JSON string typically).
 */
function postFormSubmit(
    token: string,
    fields: Record<string, string>,
    headers: Record<string, string>,
    timeoutMs = 12000
): Promise<FormSubmitResult> {
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
                    "Content-Length": Buffer.byteLength(postData).toString(),
                    ...headers,
                },
            },
            (res) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => resolve({ status: res.statusCode || 0, body: data }));
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

            // ---- Validate input (so users get helpful errors) ----
            if (!email || !message) {
                return res.status(400).json({
                    ok: false,
                    error: { code: "VALIDATION", message: "Please enter your email and a message." },
                });
            }

            const emailTrim = String(email).trim();
            if (!isValidEmail(emailTrim)) {
                return res.status(400).json({
                    ok: false,
                    error: { code: "INVALID_EMAIL", message: "Please enter a valid email address." },
                });
            }

            const msgTrim = String(message).trim();
            if (msgTrim.length < 2) {
                return res.status(400).json({
                    ok: false,
                    error: { code: "VALIDATION", message: "Message is too short." },
                });
            }

            // ---- FormSubmit token must exist in prod ----
            const token = String(process.env.FORMSUBMIT_TOKEN || "").trim();
            if (!token) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        code: "MISSING_CONFIG",
                        message: "Server not configured (missing FORMSUBMIT_TOKEN).",
                    },
                });
            }

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            // ---- Build fields ----
            // NOTE: FormSubmit sends to the email address tied to the token/email you activated.
            const fields: Record<string, string> = {
                name: clamp(name || "", 200),
                email: clamp(emailTrim, 320),
                message: clamp(msgTrim, 5000),
                listingId: clamp(listingId || "", 50),
                _subject: clamp(subject, 200),
                _replyto: emailTrim,
                _template: "table",
            };

            // ---- Pass origin/referer (FormSubmit can be picky) ----
            // Prefer the browser origin if available; fallback to your live domain.
            const origin =
                String(req.headers.origin || "").trim() || process.env.PUBLIC_ORIGIN || "https://la-maison.onrender.com";
            const referer =
                String(req.headers.referer || "").trim() || process.env.PUBLIC_REFERER || "https://la-maison.onrender.com/";

            const extraHeaders: Record<string, string> = {
                Origin: origin,
                Referer: referer,
                "User-Agent": "la-maison-inquiry/1.0",
            };

            const r = await postFormSubmit(token, fields, extraHeaders, 12000);

            // ---- Parse FormSubmit response (usually JSON) ----
            let parsed: any = null;
            try {
                parsed = JSON.parse(r.body);
            } catch {
                parsed = null;
            }

            const ms = Date.now() - startedAt;

            // Success cases can vary. If FormSubmit returns {"success":"true"...} treat as ok.
            const successFlag = parsed?.success;
            const success =
                r.status >= 200 &&
                r.status < 300 &&
                (successFlag === true || successFlag === "true" || typeof successFlag === "undefined");

            if (success) {
                console.log("[inquiry] FormSubmit OK:", { status: r.status, ms });
                return res.status(200).json({ ok: true });
            }

            // ---- Surface REAL upstream message to client ----
            const upstreamMsg =
                parsed?.message ||
                parsed?.error ||
                (r.body ? String(r.body).slice(0, 240) : "") ||
                "FormSubmit failed.";

            console.error("[inquiry] FormSubmit FAILED:", {
                status: r.status,
                ms,
                upstreamMsg,
                bodyPreview: String(r.body || "").slice(0, 1200),
            });

            // Useful mapping so your UI can show the right prompt
            const needsActivation =
                typeof upstreamMsg === "string" && upstreamMsg.toLowerCase().includes("needs activation");

            return res.status(502).json({
                ok: false,
                error: {
                    code: needsActivation ? "FORMSUBMIT_NEEDS_ACTIVATION" : "FORMSUBMIT_FAILED",
                    message: needsActivation
                        ? "Email sending is temporarily paused (FormSubmit needs activation). Please try again shortly."
                        : "Failed to send. Please try again in a moment, or email us directly.",
                    detail: upstreamMsg, // keep detail for debugging + optionally show in dev
                    status: r.status,
                },
            });
        } catch (e: any) {
            console.error("[inquiry] Failed:", e);
            return res.status(500).json({
                ok: false,
                error: {
                    code: "SERVER_ERROR",
                    message: "Unexpected error. Please try again in a moment.",
                },
            });
        }
    });
}