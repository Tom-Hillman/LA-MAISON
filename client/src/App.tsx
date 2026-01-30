import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { Toaster } from "sonner";

import Home from "@/pages/home";
import Property from "@/pages/property";

/**
 * Simple scroll restoration for SPA:
 * - On normal navigation (push), scroll to top
 * - On browser back/forward (popstate), restore previous scroll position
 */
function useScrollRestoration() {
    const [location] = useLocation();
    const lastPathRef = useRef<string>(
        window.location.pathname + window.location.search + window.location.hash
    );
    const isPopRef = useRef(false);
    const positionsRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        const onPop = () => {
            isPopRef.current = true;
            // allow the router to update first
            setTimeout(() => {
                isPopRef.current = false;
            }, 0);
        };
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const key =
                window.location.pathname + window.location.search + window.location.hash;
            positionsRef.current.set(key, window.scrollY);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const key =
            window.location.pathname + window.location.search + window.location.hash;

        // Save last route scroll before route changes
        const prevKey = lastPathRef.current;
        positionsRef.current.set(prevKey, window.scrollY);
        lastPathRef.current = key;

        if (isPopRef.current) {
            const y = positionsRef.current.get(key) ?? 0;
            requestAnimationFrame(() => window.scrollTo(0, y));
        } else {
            requestAnimationFrame(() => window.scrollTo(0, 0));
        }
    }, [location]);
}

export default function App() {
    useScrollRestoration();

    return (
        <>
            {/* Beautiful site-wide notifications */}
            <Toaster richColors position="top-right" />

            <Switch>
                <Route path="/" component={Home} />
                <Route path="/properties/:id" component={Property} />
                <Route>
                    <Home />
                </Route>
            </Switch>
        </>
    );
}