import type { Express, Request, Response } from "express";
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
    timeoutMs = 12000
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
            }
        );

        req.on("error", reject);

        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error(`FormSubmit timeout after ${timeoutMs}ms`));
        });

        req.write(postData);
        req.end();
    });
}

export function registerInquiryRoute(app: Express) {
    app.post("/api/inquiry", async (req: Request, res: Response) => {
        try {
            const { name, email, message, listingId } = (req.body || {}) as InquiryBody;

            if (!email || !message) return res.status(400).send("Missing email or message");

            // IMPORTANT: Put your token here OR in env
            const token = (process.env.FORMSUBMIT_TOKEN || "c1099dea6554dbe112294ce151bc6f04").trim();

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            const fields: Record<string, string> = {
                name: name || "",
                email,
                message,
                listingId: listingId || "",
                _subject: subject,
                _replyto: email,
                _template: "table",
                _captcha: "false",
            };

            const r = await postFormSubmit(token, fields, 12000);

            // If FormSubmit returns non-2xx, return the body so you can see why
            if (r.status < 200 || r.status >= 300) {
                console.error("[inquiry] FormSubmit status:", r.status, "body:", r.body);
                return res.status(500).json({
                    ok: false,
                    error: "FormSubmit failed",
                    status: r.status,
                    body: r.body,
                });
            }

            return res.status(200).json({ ok: true, provider: "formsubmit" });
        } catch (e: any) {
            console.error("[inquiry] Error:", e?.message || e);
            return res.status(500).json({ ok: false, error: "Failed to send", detail: String(e?.message || e) });
        }
    });
}
