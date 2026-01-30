import type { Express, Request, Response } from "express";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

function safeTrim(v: unknown) {
    return typeof v === "string" ? v.trim() : "";
}

export function registerInquiryRoute(app: Express) {
    app.post("/api/inquiry", async (req: Request, res: Response) => {
        const startedAt = Date.now();

        try {
            const { name, email, message, listingId } = (req.body || {}) as InquiryBody;

            const fromEmail = safeTrim(email);
            const msg = safeTrim(message);

            if (!fromEmail || !msg) {
                return res.status(400).json({ ok: false, error: "Missing email or message" });
            }

            const token = safeTrim(process.env.FORMSUBMIT_TOKEN);
            if (!token) {
                // IMPORTANT: in Render you MUST set FORMSUBMIT_TOKEN in Env Vars
                return res.status(500).json({ ok: false, error: "Missing FORMSUBMIT_TOKEN env var" });
            }

            // Node 18+ has fetch. If your runtime is older, this will tell you immediately.
            if (typeof fetch !== "function") {
                return res.status(500).json({ ok: false, error: "Server runtime has no fetch() (need Node 18+)" });
            }

            const publicOrigin =
                safeTrim(process.env.PUBLIC_ORIGIN) || "https://la-maison.onrender.com";

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            // FormSubmit AJAX endpoint
            const url = `https://formsubmit.co/ajax/${encodeURIComponent(token)}`;

            const body = new URLSearchParams({
                name: safeTrim(name),
                email: fromEmail,
                message: msg,
                listingId: safeTrim(listingId),
                _subject: subject,
                _replyto: fromEmail,
                _template: "table",
            });

            // Timeout so the client never “spins forever”
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12_000);

            try {
                const resp = await fetch(url, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",

                        // These are CRITICAL for FormSubmit to treat it as a real website submission.
                        Origin: publicOrigin,
                        Referer: publicOrigin.endsWith("/") ? publicOrigin : publicOrigin + "/",

                        // Some edge cases behave better with a UA present.
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
                    },
                    body,
                    signal: controller.signal,
                });

                // Try JSON first (what we asked for).
                let data: any = null;
                let rawText = "";
                const ct = resp.headers.get("content-type") || "";

                if (ct.includes("application/json")) {
                    try {
                        data = await resp.json();
                    } catch {
                        data = null;
                    }
                } else {
                    rawText = await resp.text();
                }

                // FormSubmit sometimes returns 200 + success:false (THIS WAS YOUR ISSUE).
                const successFlag =
                    (data && (data.success === true || data.success === "true")) || false;

                if (!resp.ok || (data && data.success === "false") || (data && successFlag === false)) {
                    console.error("[inquiry] FormSubmit rejected:", {
                        status: resp.status,
                        data,
                        rawPreview: rawText.slice(0, 300),
                        ms: Date.now() - startedAt,
                        origin: publicOrigin,
                    });

                    return res.status(502).json({
                        ok: false,
                        error: "FormSubmit rejected the request",
                        detail: data?.message || "Check Origin/Referer + token activation",
                    });
                }

                console.log("[inquiry] formsubmit ok:", { status: resp.status, ms: Date.now() - startedAt });
                return res.status(200).json({ ok: true, provider: "formsubmit" });
            } finally {
                clearTimeout(timeout);
            }
        } catch (e: any) {
            console.error("[inquiry] failed:", e);
            return res.status(500).json({ ok: false, error: "Failed to send inquiry" });
        }
    });
}