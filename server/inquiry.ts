import type { Express, Request, Response } from "express";
import https from "https";
import querystring from "querystring";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

type ApiOk = { ok: true; provider: "formsubmit" };
type ApiErr = { ok: false; error: { code: string; message: string; field?: string } };

function sendErr(res: Response, status: number, code: string, message: string, field?: string) {
    const payload: ApiErr = { ok: false, error: { code, message, ...(field ? { field } : {}) } };
    return res.status(status).json(payload);
}

function isValidEmail(email: string) {
    // Not perfect, but good enough for UX + avoids obvious junk
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function postFormSubmit(
    token: string,
    fields: Record<string, string>,
    timeoutMs = 12000,
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
                res.on("end", () => resolve({ status: res.statusCode || 0, body: data }));
            },
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

            // ---------- Basic validation (for nice UI errors) ----------
            const emailStr = String(email || "").trim();
            const messageStr = String(message || "").trim();
            const nameStr = String(name || "").trim();
            const listingStr = String(listingId || "").trim();

            if (!emailStr) return sendErr(res, 400, "EMAIL_REQUIRED", "Please enter your email.", "email");
            if (!isValidEmail(emailStr))
                return sendErr(res, 400, "EMAIL_INVALID", "Please enter a valid email address.", "email");

            if (!messageStr) return sendErr(res, 400, "MESSAGE_REQUIRED", "Please enter a message.", "message");
            if (messageStr.length < 5)
                return sendErr(res, 400, "MESSAGE_TOO_SHORT", "Message is too short.", "message");

            // ---------- FormSubmit token ----------
            const token = String(process.env.FORMSUBMIT_TOKEN || "").trim();
            if (!token) {
                return sendErr(
                    res,
                    500,
                    "MISSING_FORMSUBMIT_TOKEN",
                    "Server misconfigured: missing FORMSUBMIT_TOKEN",
                );
            }

            // Subject for the email you receive
            const subject = listingStr ? `New inquiry: ${listingStr}` : "New inquiry: La Maison";

            // Fields sent to FormSubmit
            const fields: Record<string, string> = {
                name: nameStr,
                email: emailStr,
                message: messageStr,
                listingId: listingStr,
                _subject: subject,
                _replyto: emailStr,
                _template: "table",
                // If you want: _captcha: "false" (I recommend leaving captcha ON unless it annoys you)
            };

            const r = await postFormSubmit(token, fields, 12000);

            // FormSubmit sometimes returns JSON (ideal) but can return HTML on misconfig.
            let parsed: any = null;
            try {
                parsed = JSON.parse(r.body);
            } catch {
                // ignore
            }

            const ms = Date.now() - startedAt;

            // Success cases:
            // - HTTP 200 and JSON success === "true"
            // - Some responses are not strictly documented, so we accept any 2xx with no "success:false"
            const successFlag = String(parsed?.success || "").toLowerCase();
            const isExplicitFailure = successFlag === "false";

            if (r.status >= 200 && r.status < 300 && !isExplicitFailure) {
                console.log("[inquiry] sent via FormSubmit:", {
                    status: r.status,
                    ms,
                    bodyPreview: String(r.body || "").slice(0, 200),
                });
                const payload: ApiOk = { ok: true, provider: "formsubmit" };
                return res.status(200).json(payload);
            }

            console.error("[inquiry] FormSubmit failed:", {
                status: r.status,
                ms,
                bodyPreview: String(r.body || "").slice(0, 800),
            });

            // Common FormSubmit message you hit earlier:
            // "Make sure you open this page through a web server..."
            const msg =
                parsed?.message ||
                "Failed to send. Please try again in a moment, or email us directly.";

            return sendErr(res, 502, "FORMSUBMIT_FAILED", msg);
        } catch (e: any) {
            console.error("[inquiry] Failed:", e);
            return sendErr(res, 500, "INTERNAL_ERROR", "Failed to send. Please try again.");
        }
    });
}