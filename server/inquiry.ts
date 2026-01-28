import type { Express, Request, Response } from "express";
import nodemailer from "nodemailer";

type InquiryBody = {
    name?: string;
    email?: string;
    message?: string;
    listingId?: string;
};

export function registerInquiryRoute(app: Express) {
    app.post("/api/inquiry", async (req: Request, res: Response) => {
        try {
            const { name, email, message, listingId } = (req.body || {}) as InquiryBody;

            if (!email || !message) {
                return res.status(400).send("Missing email or message");
            }

            // You MUST set these env vars in Render:
            // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, INQUIRY_TO
            const host = process.env.SMTP_HOST;
            const port = Number(process.env.SMTP_PORT || "587");
            const user = process.env.SMTP_USER;
            const pass = process.env.SMTP_PASS;

            const to = process.env.INQUIRY_TO || "tom.1103.hillman@gmail.com";

            if (!host || !user || !pass) {
                return res.status(500).send("Email not configured: missing SMTP env vars");
            }

            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });

            const subject = listingId ? `New inquiry: ${listingId}` : "New inquiry: La Maison";

            const text = [
                `Name: ${name || "(not provided)"}`,
                `Email: ${email}`,
                listingId ? `Listing: ${listingId}` : "",
                "",
                `Message:`,
                message,
            ]
                .filter(Boolean)
                .join("\n");

            await transporter.sendMail({
                from: `"La Maison Website" <${user}>`,
                to,
                replyTo: email,
                subject,
                text,
            });

            return res.status(200).json({ ok: true });
        } catch (e: any) {
            console.error(e);
            return res.status(500).send("Failed to send email");
        }
    });
}
