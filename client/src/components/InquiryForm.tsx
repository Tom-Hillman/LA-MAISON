import React, { useMemo, useState } from "react";
import { useToast } from "./Toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export default function InquiryForm({
                                        listingId,
                                    }: {
    listingId?: string;
}) {
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [sending, setSending] = useState(false);
    const [sentTick, setSentTick] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const msgLen = useMemo(() => message.trim().length, [message]);

    function validate() {
        const next: FieldErrors = {};

        const e = email.trim();
        const m = message.trim();

        if (!e) next.email = "Please enter your email.";
        else if (!emailRegex.test(e)) next.email = "That email doesn’t look valid.";

        if (!m) next.message = "Please write a message.";
        else if (m.length < 10) next.message = "Please add a bit more detail (10+ characters).";

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) {
            toast({
                kind: "error",
                title: "Fix the highlighted fields",
                message: "Some details are missing or invalid.",
            });
            return;
        }

        setSending(true);
        setSentTick(false);

        try {
            const resp = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                    listingId,
                }),
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok || !data?.ok) {
                if (data?.fieldErrors && typeof data.fieldErrors === "object") {
                    setErrors((prev) => ({ ...prev, ...data.fieldErrors }));
                }

                toast({
                    kind: "error",
                    title: "Couldn’t send",
                    message: data?.detail || data?.error || "Failed to send. Please try again.",
                });

                return;
            }

            toast({
                kind: "success",
                title: "Sent",
                message: "Thanks — we’ll get back to you shortly.",
            });

            setSentTick(true);
            setMessage("");
            setErrors({});

            window.setTimeout(() => setSentTick(false), 1500);
        } catch (err) {
            toast({
                kind: "error",
                title: "Network error",
                message: "Please check your connection and try again.",
            });
        } finally {
            setSending(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="mb-1 block text-sm text-slate-700">Name (optional)</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={[
                        "w-full rounded-xl border px-4 py-3 text-sm outline-none transition",
                        errors.name ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-slate-400",
                    ].join(" ")}
                    placeholder="Your name"
                />
                {errors.name && <div className="mt-1 text-xs text-red-600">{errors.name}</div>}
            </div>

            {/* Email */}
            <div>
                <label className="mb-1 block text-sm text-slate-700">Email</label>
                <input
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    className={[
                        "w-full rounded-xl border px-4 py-3 text-sm outline-none transition",
                        errors.email ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-slate-400",
                    ].join(" ")}
                    placeholder="you@example.com"
                    inputMode="email"
                    autoComplete="email"
                />
                {errors.email && <div className="mt-1 text-xs text-red-600">{errors.email}</div>}
            </div>

            {/* Message */}
            <div>
                <label className="mb-1 block text-sm text-slate-700">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                    }}
                    className={[
                        "min-h-[120px] w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition",
                        errors.message ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-slate-400",
                    ].join(" ")}
                    placeholder="Tell us what you're looking for…"
                />
                <div className="mt-1 flex items-center justify-between">
                    {errors.message ? (
                        <div className="text-xs text-red-600">{errors.message}</div>
                    ) : (
                        <div className="text-xs text-slate-400">We typically reply within 24–48 hours.</div>
                    )}
                    <div className="text-xs text-slate-400">{Math.min(msgLen, 500)}/500</div>
                </div>
            </div>

            <button
                type="submit"
                disabled={sending}
                className={[
                    "w-full rounded-2xl px-5 py-3 text-sm font-semibold transition",
                    sending
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-slate-900 text-white hover:bg-slate-800",
                ].join(" ")}
            >
                {sending ? "Sending…" : sentTick ? "Sent ✓" : "Send inquiry"}
            </button>
        </form>
    );
}