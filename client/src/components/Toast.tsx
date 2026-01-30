import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Variant = "default" | "destructive";

export type ToastOptions = {
    title?: string;
    description?: string;
    variant?: Variant;
    durationMs?: number;
};

type ToastItem = ToastOptions & { id: string };

type ToastFn = ((opts: ToastOptions) => void) & { toast?: (opts: ToastOptions) => void };

type ToastContextValue = {
    _push: (opts: ToastOptions) => void;
    _remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

// ---- Global hookable function (works outside components too) ----
let __globalPush: null | ((opts: ToastOptions) => void) = null;

export const toast: ToastFn = ((opts: ToastOptions) => {
    if (__globalPush) __globalPush(opts);
    else console.warn("ToastProvider not mounted yet. Toast dropped:", opts);
}) as ToastFn;

// allow toast.toast({...}) too
toast.toast = toast;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);
    const timers = useRef<Record<string, number>>({});

    const _remove = useCallback((id: string) => {
        setItems((prev) => prev.filter((t) => t.id !== id));
        const t = timers.current[id];
        if (t) window.clearTimeout(t);
        delete timers.current[id];
    }, []);

    const _push = useCallback(
        (opts: ToastOptions) => {
            const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const durationMs = opts.durationMs ?? 3200;

            const next: ToastItem = { id, ...opts };
            setItems((prev) => [next, ...prev].slice(0, 4));

            timers.current[id] = window.setTimeout(() => _remove(id), durationMs);
        },
        [_remove]
    );

    // wire global
    __globalPush = _push;

    const value = useMemo(() => ({ _push, _remove }), [_push, _remove]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="fixed right-4 top-4 z-[99999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={[
                            "relative overflow-hidden rounded-2xl border bg-white/90 p-4 shadow-xl backdrop-blur",
                            t.variant === "destructive" ? "border-red-200" : "border-slate-200",
                        ].join(" ")}
                    >
                        <div
                            className={[
                                "absolute left-0 top-0 h-full w-1.5",
                                t.variant === "destructive" ? "bg-red-500" : "bg-slate-500",
                            ].join(" ")}
                        />
                        <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                                {t.title && <div className="text-sm font-semibold text-slate-900">{t.title}</div>}
                                {t.description && <div className="text-sm text-slate-600">{t.description}</div>}
                            </div>

                            <button
                                onClick={() => _remove(t.id)}
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
    const ctx = useContext(ToastContext);
    if (!ctx) {
        // still return a callable function so your app doesn't crash
        return toast;
    }

    const fn: ToastFn = ((opts: ToastOptions) => ctx._push(opts)) as ToastFn;
    fn.toast = fn;
    return fn;
}