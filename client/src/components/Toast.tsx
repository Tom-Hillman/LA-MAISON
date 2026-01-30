import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Variant = "default" | "destructive";
type ToastKind = "success" | "error" | "info";

type ToastCall = {
    title?: string;
    description?: string;
    variant?: Variant;
    duration?: number;
};

type ToastItem = {
    id: string;
    kind: ToastKind;
    title?: string;
    message: string;
};

type ToastFn = (t: ToastCall) => void;

const ToastContext = createContext<ToastFn | null>(null);

function variantToKind(variant?: Variant): ToastKind {
    if (variant === "destructive") return "error";
    return "info";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);
    const timers = useRef<Record<string, number>>({});

    const remove = useCallback((id: string) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
        const t = timers.current[id];
        if (t) window.clearTimeout(t);
        delete timers.current[id];
    }, []);

    const toast = useCallback(
        ({ title, description, variant = "default", duration = 3200 }: ToastCall) => {
            const message = (description ?? "").trim();
            const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

            const next: ToastItem = {
                id,
                kind: variantToKind(variant),
                title: title?.trim() || undefined,
                message: message || " ",
            };

            setItems((prev) => [next, ...prev].slice(0, 3));
            timers.current[id] = window.setTimeout(() => remove(id), duration);
        },
        [remove]
    );

    const value = useMemo(() => toast, [toast]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast stack */}
            <div className="fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={[
                            "relative overflow-hidden rounded-2xl border bg-white/90 p-4 shadow-xl backdrop-blur",
                            "transition-all duration-200",
                            t.kind === "error" ? "border-red-200" : "border-slate-200",
                        ].join(" ")}
                    >
                        {/* accent bar */}
                        <div
                            className={[
                                "absolute left-0 top-0 h-full w-1.5",
                                t.kind === "error" ? "bg-red-500" : "bg-slate-500",
                            ].join(" ")}
                        />

                        <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                                {t.title && <div className="text-sm font-semibold text-slate-900">{t.title}</div>}
                                <div className="text-sm text-slate-600">{t.message}</div>
                            </div>

                            <button
                                onClick={() => remove(t.id)}
                                className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Dismiss"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastFn {
    const toast = useContext(ToastContext);
    if (!toast) throw new Error("useToast must be used inside <ToastProvider>");
    return toast;
}