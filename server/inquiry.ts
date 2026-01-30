import type { Express, Request, Response } from "express";
import http from "http";
import https from "https";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

// Minimal POST helper (no fetch dependency, works on any Node)
function postUrlEncoded(
    urlString: string,
    data: Record<string, string>,
    timeoutMs = 12000
): Promise<{ status: number; body: string }> {
    return new Promise((resolve, reject) => {
        const u = new URL(urlString);
        const body = new URLSearchParams(data).toString();

        const isHttps = u.protocol === "https:";
        const lib = isHttps ? https : http;

        const req = lib.request(
            {
                method: "POST",
                hostname: u.hostname,
                port: u.port ? Number(u.port) : isHttps ? 443 : 80,
                path: `${u.pathname}${u.search}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(body),
                    "Accept": "application/json, text/plain, */*",
                    "User-Agent": "LaMaison/1.0 (+inquiry proxy)",
                },
            },
            (resp) => {
                let chunks = "";
                resp.on("data", (d) => (chunks += d));
                resp.on("end", () => {
                    resolve({ status: resp.statusCode || 0, body: chunks });
                });
            }
        );

        req.on("error", reject);
        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error(`Timeout after ${timeoutMs}ms`));
        });

        req.write(body);
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

            const token = (process.env.FORMSUBMIT_TOKEN || "").trim();
            if (!token) {
                return res.status(500).send("Missing FORMSUBMIT_TOKEN env var");
            }

            // IMPORTANT: token belongs in the normal endpoint (matches their activation email)
            const formsubmitUrl = `https://formsubmit.co/${encodeURIComponent(token)}`;

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            // Server-side submission => disable captcha (captcha needs a browser)
            const payload: Record<string, string> = {
                name: name || "",
                email,
                message,
                listingId: listingId || "",
                _subject: subject,
                _replyto: email,
                _template: "table",
                _captcha: "false",
            };

            const r = await postUrlEncoded(formsubmitUrl, payload, 12000);

            // If FormSubmit doesn’t accept it, DO NOT return 200.
            if (r.status < 200 || r.status >= 300) {
                console.error("[inquiry] FormSubmit non-2xx:", {
                    status: r.status,
                    ms: Date.now() - startedAt,
                    body: r.body?.slice(0, 500),
                });
                return res.status(502).send("Failed to send email");
            }

            // Log short response for debugging (Render logs)
            console.log("[inquiry] sent via FormSubmit:", {
                status: r.status,
                ms: Date.now() - startedAt,
                bodyPreview: (r.body || "").slice(0, 200),
            });

            return res.status(200).json({ ok: true, provider: "formsubmit" });
        } catch (e: any) {
            console.error("[inquiry] Failed:", e?.message || e, "ms:", Date.now() - startedAt);
            return res.status(500).send("Failed to send email");
        }
    });
}
