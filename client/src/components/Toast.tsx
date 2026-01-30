// client/src/components/Toast.tsx
import React from "react";
import { Toaster, toast } from "sonner";

export { toast };

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={3500}
            />
        </>
    );
}