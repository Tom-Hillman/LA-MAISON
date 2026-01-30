import type { Express, Request, Response } from "express";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function registerInquiryRoute(app: Express) {
    app.post("/api/inquiry", async (req: Request, res: Response) => {
        const startedAt = Date.now();

        try {
            const body = (req.body || {}) as InquiryBody;

            const name = (body.name || "").trim();
            const email = (body.email || "").trim();
            const message = (body.message || "").trim();
            const listingId = (body.listingId || "").trim();

            // ---------- Validation ----------
            const fieldErrors: Record<string, string> = {};

            if (!email) fieldErrors.email = "Please enter your email.";
            else if (!emailRegex.test(email)) fieldErrors.email = "That email doesn’t look valid.";

            if (!message) fieldErrors.message = "Please write a message.";
            else if (message.length < 10) fieldErrors.message = "Please add a bit more detail (10+ characters).";

            if (Object.keys(fieldErrors).length) {
                return res.status(400).json({
                    ok: false,
                    error: "Validation error",
                    fieldErrors,
                });
            }

            const token = (process.env.FORMSUBMIT_TOKEN || "").trim();
            if (!token) {
                return res.status(500).json({
                    ok: false,
                    error: "Missing FORMSUBMIT_TOKEN env var",
                    detail: "Set FORMSUBMIT_TOKEN in your Render environment variables.",
                });
            }

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            // FormSubmit expects x-www-form-urlencoded
            const form = new URLSearchParams();
            form.set("name", name || "");
            form.set("email", email);
            form.set("message", message);
            if (listingId) form.set("listingId", listingId);

            // FormSubmit controls
            form.set("_subject", subject);
            form.set("_replyto", email);
            form.set("_template", "table");

            // IMPORTANT: send to ajax endpoint
            const url = `https://formsubmit.co/ajax/${encodeURIComponent(token)}`;

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);

            let status = 0;
            let respText = "";

            try {
                const resp = await fetch(url, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    body: form,
                    signal: controller.signal,
                });

                status = resp.status;
                respText = await resp.text();

                if (!resp.ok) {
                    console.error("[inquiry] FormSubmit failed:", {
                        status,
                        ms: Date.now() - startedAt,
                        bodyPreview: respText.slice(0, 300),
                    });

                    return res.status(502).json({
                        ok: false,
                        error: "FormSubmit failed",
                        detail: "Could not send message. Please try again in a moment.",
                    });
                }

                console.log("[inquiry] sent via FormSubmit:", {
                    status,
                    ms: Date.now() - startedAt,
                    bodyPreview: respText.slice(0, 120),
                });

                return res.status(200).json({ ok: true, provider: "formsubmit" });
            } finally {
                clearTimeout(timeout);
            }
        } catch (e: any) {
            console.error("[inquiry] error:", e, "ms:", Date.now() - startedAt);
            return res.status(500).json({
                ok: false,
                error: "Failed to send email",
                detail: "Server error. Please try again shortly.",
            });
        }
    });
}