import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    motion,
    useInView,
    useScroll,
    useSpring,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import {
    Home as HomeIcon,
    Info,
    Utensils,
    Globe,
    Phone,
    MapPin,
    BedDouble,
    Bath,
    Ruler,
    X,
    ArrowDown,
    Share2,
    SlidersHorizontal,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Clock,
    Handshake,
    ShieldCheck,
    Languages,
} from "lucide-react";
import Lenis from "lenis";
import { useLocation } from "wouter";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Generated Assets
import HERO_PRIMARY_IMG from "@assets/generated_images/luxury_mexican_hacienda_courtyard.png";
import TEXTURE_IMG from "@assets/generated_images/beige_plaster_texture.png";
import INTERIOR_IMG from "@assets/generated_images/minimalist_hacienda_interior.png";
import CENOTE_IMG from "@assets/generated_images/mystical_yucatan_cenote.png";
import BEACH_IMG from "@assets/generated_images/luxury_beach_club_tulum.png";
import TEXTILE_IMG from "@assets/generated_images/artisanal_mexican_textiles.png";

import { LISTINGS, LISTING_IMAGES, formatUSD, type Listing } from "@/data/listings";

// ---------------- Images ----------------
const HERO_PRIMARY = HERO_PRIMARY_IMG;
const HERO_FALLBACK =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80";

function safeImage(primary: string, fallback: string) {
    return {
        src: primary,
        onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.currentTarget;
            if ((img as any).dataset?.fallbackApplied) return;
            (img as any).dataset.fallbackApplied = "1";
            img.src = fallback;
        },
    };
}

function cn(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

// ---------------- i18n ----------------
type Lang = "en" | "es";

const copy = {
    en: {
        nav: { home: "HOME", who: "WHY INVEST", properties: "PROPERTIES", lifestyle: "LIFESTYLE", contact: "CONTACT" },
        properties: {
            title: "PROPERTIES",
            inquire: "INQUIRE",
            share: "SHARE",
            curated: "Curated selection",
            openFilters: "FILTERS",
            apply: "APPLY",
            clear: "CLEAR",
            results: "Results",
            any: "Any",
            priceMin: "Min price (USD)",
            priceMax: "Max price (USD)",
            bedsMin: "Beds (min)",
            bathsMin: "Baths (min)",
            areaMin: "Area m² (min)",
            type: "Property type",
            regions: "Locations",
            noMatch: "No listings match these filters yet.",
        },
        toast: {
            copied: "Link copied",
            copiedDesc: "The listing link was copied to your clipboard.",
            invalid: "Please check your details",
            invalidDesc: "Name, email, and message are required (valid email).",
            sending: "Sending…",
            sent: "Message sent",
            sentDesc: "We received your inquiry and will respond soon.",
            error: "Something went wrong",
        },
        contact: { title: "CONTACT", send: "SEND MESSAGE", name: "Name", email: "Email", message: "Message" },
        why: {
            label: "WHY INVEST WITH US",
            headline: "Local execution. Global-level service.",
            pitch:
                "We help you buy, set up, and own property in Mexico with less friction—better decisions, faster timelines, and trusted on-the-ground support.",
            trust: {
                a: { h: "Local partners", t: "On-the-ground coordination you can trust." },
                b: { h: "Clear timelines", t: "We reduce friction and keep things moving." },
                c: { h: "Transparent process", t: "No guesswork—simple, direct steps." },
                d: { h: "Bilingual support", t: "English/Spanish guidance when it matters." },
            },
        },
        lifestyle: {
            title: "Lifestyle",
            subtitle:
                "Click to explore where we operate, how we take care of your home, and what we do for buyers and owners.",
            cards: {
                locations: { title: "Locations", subtitle: "Where we operate" },
                homecare: { title: "Home care", subtitle: "We handle it end-to-end" },
                about: { title: "About us", subtitle: "Who we are & what we do" },
            },
        },
        overlays: {
            locations: {
                title: "Locations",
                body:
                    "We operate across key areas in Mexico, with local partners and on-the-ground execution.",
                listTitle: "Active areas",
                list: ["Riviera Maya", "Yucatán", "Mexico City", "Oaxaca", "Countryside"],
            },
            homecare: {
                title: "Home care",
                body:
                    "From purchase to daily operations—our team coordinates everything so ownership feels effortless and consistent.",
                bullets: [
                    { h: "Design & Setup", t: "Furnishing direction, finishes, staging—aligned with your home’s identity." },
                    { h: "Maintenance & Checks", t: "Routine inspections, preventive maintenance, fast fixes when needed." },
                    { h: "Care While You’re Away", t: "Cleaning, utilities coordination, trusted local management." },
                    { h: "Rent-ready Support", t: "Operational coordination, turnover workflows, standards & quality control." },
                ],
            },
            about: {
                title: "About us",
                body:
                    "LA MAISON is a boutique property platform focused on Mexico. We curate strong homes and support buyers and owners with practical, local execution.",
                bullets: [
                    { h: "Curated properties", t: "Homes selected for quality, location, and long-term value." },
                    { h: "Local execution", t: "We coordinate viewings, paperwork touchpoints, and trusted partners." },
                    { h: "Owner support", t: "Setup, care, and light operations so ownership stays frictionless." },
                ],
            },
        },
    },

    es: {
        nav: { home: "INICIO", who: "POR QUÉ INVERTIR", properties: "PROPIEDADES", lifestyle: "ESTILO DE VIDA", contact: "CONTACTO" },
        properties: {
            title: "PROPIEDADES",
            inquire: "CONSULTAR",
            share: "COMPARTIR",
            curated: "Selección curada",
            openFilters: "FILTROS",
            apply: "APLICAR",
            clear: "LIMPIAR",
            results: "Resultados",
            any: "Cualquiera",
            priceMin: "Precio mín (USD)",
            priceMax: "Precio máx (USD)",
            bedsMin: "Recámaras (mín)",
            bathsMin: "Baños (mín)",
            areaMin: "Área m² (mín)",
            type: "Tipo de propiedad",
            regions: "Ubicaciones",
            noMatch: "No hay propiedades para estos filtros.",
        },
        toast: {
            copied: "Enlace copiado",
            copiedDesc: "El enlace se copió al portapapeles.",
            invalid: "Revisa tus datos",
            invalidDesc: "Nombre, correo y mensaje son obligatorios (correo válido).",
            sending: "Enviando…",
            sent: "Mensaje enviado",
            sentDesc: "Recibimos tu consulta y responderemos pronto.",
            error: "Ocurrió un error",
        },
        contact: { title: "CONTACTO", send: "ENVIAR MENSAJE", name: "Nombre", email: "Correo", message: "Mensaje" },
        why: {
            label: "POR QUÉ INVERTIR CON NOSOTROS",
            headline: "Ejecución local. Servicio de nivel global.",
            pitch:
                "Te ayudamos a comprar, preparar y gestionar propiedad en México con menos fricción—mejores decisiones, tiempos más rápidos y apoyo confiable en el terreno.",
            trust: {
                a: { h: "Aliados locales", t: "Coordinación real en el terreno." },
                b: { h: "Tiempos claros", t: "Reducimos fricción y avanzamos rápido." },
                c: { h: "Proceso claro", t: "Pasos simples, sin adivinar." },
                d: { h: "Soporte bilingüe", t: "Guía en inglés/español cuando importa." },
            },
        },
        lifestyle: {
            title: "Estilo de Vida",
            subtitle:
                "Haz clic para ver dónde operamos, cómo cuidamos tu casa y qué hacemos para compradores y propietarios.",
            cards: {
                locations: { title: "Ubicaciones", subtitle: "Dónde operamos" },
                homecare: { title: "Cuidado del hogar", subtitle: "Lo gestionamos de principio a fin" },
                about: { title: "Sobre nosotros", subtitle: "Quiénes somos y qué hacemos" },
            },
        },
        overlays: {
            locations: {
                title: "Ubicaciones",
                body:
                    "Operamos en zonas clave de México, con aliados locales y ejecución en el terreno.",
                listTitle: "Zonas activas",
                list: ["Riviera Maya", "Yucatán", "Ciudad de México", "Oaxaca", "Zona rural"],
            },
            homecare: {
                title: "Cuidado del hogar",
                body:
                    "Desde la compra hasta la operación del día a día—coordinamos todo para que ser propietario sea simple y consistente.",
                bullets: [
                    { h: "Diseño y Preparación", t: "Mobiliario, acabados y ambientación alineados a la identidad de tu hogar." },
                    { h: "Mantenimiento y Revisiones", t: "Inspecciones, mantenimiento preventivo y reparaciones rápidas." },
                    { h: "Cuidado Cuando No Estás", t: "Limpieza, coordinación de servicios y gestión local confiable." },
                    { h: "Soporte para Renta", t: "Operación, rotación, estándares y control de calidad." },
                ],
            },
            about: {
                title: "Sobre nosotros",
                body:
                    "LA MAISON es una plataforma boutique enfocada en México. Curamos propiedades sólidas y apoyamos a compradores y propietarios con ejecución práctica y local.",
                bullets: [
                    { h: "Propiedades curadas", t: "Casas seleccionadas por calidad, ubicación y valor a largo plazo." },
                    { h: "Ejecución local", t: "Coordinamos visitas, puntos del papeleo y aliados confiables." },
                    { h: "Soporte al propietario", t: "Preparación, cuidado y operación ligera para minimizar fricción." },
                ],
            },
        },
    },
} as const;

// ---------------- Micro utilities ----------------
function usePointer() {
    const [p, setP] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const onMove = (e: PointerEvent) => setP({ x: e.clientX, y: e.clientY });
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, []);
    return p;
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toNum(v: string): number | null {
    const n = Number(String(v).replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : null;
}

// ---------------- Preloader ----------------
function Preloader({ onComplete }: { onComplete: () => void }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setTimeout(onComplete, 900);
        }, 1600);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1a1a1a] text-[#F5F1EA]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="font-serif tracking-[0.2em] text-3xl md:text-5xl">LA MAISON</div>
                        <div className="h-[1px] w-28 bg-[#B78454]/50 overflow-hidden relative">
                            <motion.div
                                className="absolute inset-0 bg-[#B78454]"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <p className="text-[10px] tracking-[0.3em] uppercase opacity-50">Mexico</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ---------------- Custom cursor ----------------
function CustomCursor() {
    const p = usePointer();
    const x = useSpring(p.x, { stiffness: 700, damping: 45, mass: 0.6 });
    const y = useSpring(p.y, { stiffness: 700, damping: 45, mass: 0.6 });

    const size = 18;
    const opacity = 0.55;

    return (
        <motion.div className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block mix-blend-difference" style={{ x, y }}>
            <motion.div
                className="rounded-full bg-white"
                animate={{
                    width: size,
                    height: size,
                    opacity,
                    translateX: -size / 2,
                    translateY: -size / 2,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
            />
        </motion.div>
    );
}

// ---------------- Scroll reveal wrapper ----------------
function Reveal({
                    children,
                    delay = 0,
                    direction = "up",
                    className,
                }: {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "left" | "right";
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

    const x = direction === "left" ? -22 : direction === "right" ? 22 : 0;
    const y = direction === "up" ? 16 : 0;

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, x, y, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

// ---------------- Split text + reveal ----------------
function SplitTitle({ text, className }: { text: string; className?: string }) {
    const letters = text.split("");
    return (
        <motion.h1
            className={cn("text-center font-serif tracking-[0.05em]", className)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
            {letters.map((ch, i) => (
                <motion.span
                    key={`${ch}-${i}`}
                    className="inline-block"
                    variants={{
                        hidden: { opacity: 0, y: 22, rotateX: 35, filter: "blur(10px)" },
                        show: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    {ch === " " ? "\u00A0" : ch}
                </motion.span>
            ))}
        </motion.h1>
    );
}

// ---------------- Clip-path reveal ----------------
function ClipRevealImage({
                             src,
                             fallback,
                             alt,
                             className,
                         }: {
    src: string;
    fallback: string;
    alt: string;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });

    const clip = useTransform(
        scrollYProgress,
        [0, 1],
        ["polygon(0 0, 0 0, 0 100%, 0 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]
    );
    const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1.1, 1.0]), {
        stiffness: 120,
        damping: 22,
    });

    return (
        <motion.div ref={ref} className={cn("relative overflow-hidden bg-muted", className)} style={{ clipPath: clip }}>
            <motion.img {...safeImage(src, fallback)} alt={alt} className="h-full w-full object-cover" style={{ scale }} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/35" />
        </motion.div>
    );
}

// ---------------- Noise Texture ----------------
function NoiseOverlay() {
    return (
        <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>
    );
}

// ---------------- Canvas particles ----------------
function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointer = usePointer();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const particles = Array.from({ length: 55 }).map(() => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.00055,
            vy: (Math.random() - 0.5) * 0.00055,
            r: 1 + Math.random() * 2,
        }));

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = Math.floor(w * DPR);
            canvas.height = Math.floor(h * DPR);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        let raf = 0;
        const tick = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            ctx.clearRect(0, 0, w, h);

            const mx = pointer.x;
            const my = pointer.y;
            const attract = 0.015;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -0.05) p.x = 1.05;
                if (p.x > 1.05) p.x = -0.05;
                if (p.y < -0.05) p.y = 1.05;
                if (p.y > 1.05) p.y = -0.05;

                const px = p.x * w;
                const py = p.y * h;

                const dx = mx - px;
                const dy = my - py;
                const dist = Math.max(50, Math.min(420, Math.hypot(dx, dy)));
                p.vx += (dx / dist) * attract * 0.00015;
                p.vy += (dy / dist) * attract * 0.00015;

                p.vx = Math.max(-0.002, Math.min(0.002, p.vx));
                p.vy = Math.max(-0.002, Math.min(0.002, p.vy));

                ctx.beginPath();
                ctx.fillStyle = "rgba(183,132,84,0.28)";
                ctx.arc(px, py, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, [pointer.x, pointer.y]);

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-35 mix-blend-screen" />;
}

// ---------------- Scroll progress indicator ----------------
function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });
    return (
        <motion.div className="fixed left-0 top-0 z-[9998] h-[3px] w-full bg-black/5">
            <motion.div className="h-full bg-primary" style={{ scaleX: sx, transformOrigin: "0% 50%" }} />
        </motion.div>
    );
}

// ---------------- WhatsApp Logo (inline SVG) ----------------
function WhatsAppLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
            <path d="M19.11 17.53c-.27-.14-1.6-.79-1.84-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.18-1.35-.81-.72-1.36-1.6-1.52-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27 0 1.33.98 2.62 1.11 2.8.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.28.59 4.42 1.62 6.28L3 29l6.9-1.81A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.5c-2.06 0-3.97-.6-5.58-1.63l-.4-.25-4.1 1.07 1.09-3.99-.26-.41A10.43 10.43 0 0 1 5.5 16C5.5 10.2 10.2 5.5 16 5.5S26.5 10.2 26.5 16 21.8 26.5 16 26.5z" />
        </svg>
    );
}

function WhatsAppFixedButton() {
    const wa = "https://wa.me/34667640713";
    return (
        <motion.a
            href={wa}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="fixed bottom-5 right-5 z-40 border border-[#8B4513]/40 bg-black/70 px-4 py-3 text-xs tracking-[0.22em] text-[#F5E6D3] hover:bg-black/80"
        >
      <span className="flex items-center gap-2">
        <WhatsAppLogo className="h-4 w-4" />
        <span>WHATSAPP</span>
      </span>
        </motion.a>
    );
}

/**
 * Email sending WITHOUT SMTP env vars:
 * Uses FormSubmit AJAX endpoint.
 * Note: first time may require confirming the email with FormSubmit.
 */
async function sendInquiry(payload: { name: string; email: string; message: string; listingId?: string; listingTitle?: string }) {
    const endpoint = "https://formsubmit.co/ajax/lamaisonmexico@gmail.com";

    const form = new FormData();
    form.append("name", payload.name);
    form.append("email", payload.email);
    form.append("message", payload.message);
    if (payload.listingId) form.append("listingId", payload.listingId);
    if (payload.listingTitle) form.append("listingTitle", payload.listingTitle);
    form.append("page", typeof window !== "undefined" ? window.location.href : "");
    form.append("_subject", payload.listingId ? `New inquiry: ${payload.listingId}` : "New inquiry: LA MAISON");
    form.append("_captcha", "false");

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to send inquiry");
    }
}

async function shareListing(listing: Listing) {
    const url = `${window.location.origin}/properties/${listing.id}`;
    const title = `${listing.title} — ${listing.id}`;
    const text = `${listing.title} (${listing.location})`;

    try {
        if (navigator.share) {
            await navigator.share({ title, text, url });
            return "shared" as const;
        }
    } catch {
        return "cancelled" as const;
    }

    try {
        await navigator.clipboard.writeText(url);
        return "copied" as const;
    } catch {
        prompt("Copy this link:", url);
        return "prompt" as const;
    }
}

// ---------------- Toasts (no external libs) ----------------
type ToastVariant = "success" | "error" | "info";
type ToastItem = { id: string; title: string; description?: string; variant: ToastVariant };

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
    return (
        <div className="fixed right-4 top-4 z-[99999] flex w-[92vw] max-w-sm flex-col gap-3">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            "border border-black/10 shadow-2xl bg-white px-4 py-3",
                            t.variant === "error" && "border-red-500/30",
                            t.variant === "success" && "border-emerald-500/30"
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-[11px] tracking-[0.22em] uppercase text-[#1a1a1a]">{t.title}</div>
                                {t.description && <div className="mt-1 text-sm text-[#5E5E5E] leading-snug">{t.description}</div>}
                            </div>
                            <button
                                className="text-black/40 hover:text-black/70 transition-colors"
                                onClick={() => onDismiss(t.id)}
                                aria-label="Dismiss"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ---------------- Cinematic overlay ----------------
type OverlayKey = "locations" | "homecare" | "about";

function CinematicOverlay({
                              open,
                              title,
                              subtitle,
                              heroImage,
                              onClose,
                              children,
                          }: {
    open: boolean;
    title: string;
    subtitle: string;
    heroImage: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 overflow-auto"
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 18, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative h-[46vh] min-h-[340px]">
                            <motion.img
                                {...safeImage(heroImage, HERO_FALLBACK)}
                                alt={title}
                                className="absolute inset-0 h-full w-full object-cover"
                                initial={{ scale: 1.12 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/90" />

                            <div className="relative h-full px-6 py-8 flex flex-col justify-between">
                                <div className="max-w-6xl mx-auto w-full flex items-start justify-between gap-6">
                                    <div>
                                        <div className="text-[10px] tracking-[0.32em] uppercase text-white/70 flex items-center gap-2">
                                            <Sparkles className="h-3.5 w-3.5 text-[#B78454]" />
                                            LA MAISON
                                        </div>
                                        <div className="mt-3 font-serif text-3xl md:text-5xl text-white">{title}</div>
                                        <div className="mt-4 max-w-2xl text-white/70 leading-relaxed">{subtitle}</div>
                                    </div>

                                    <button onClick={onClose} className="shrink-0 text-white/70 hover:text-white transition-colors" aria-label="Close overlay">
                                        <X className="h-7 w-7" />
                                    </button>
                                </div>

                                <div className="max-w-6xl mx-auto w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="border border-white/10 bg-white/5 px-5 py-4">
                                            <div className="text-[10px] tracking-[0.26em] uppercase text-white/60">Standard</div>
                                            <div className="mt-2 text-white text-sm">Premium coordination</div>
                                        </div>
                                        <div className="border border-white/10 bg-white/5 px-5 py-4">
                                            <div className="text-[10px] tracking-[0.26em] uppercase text-white/60">Speed</div>
                                            <div className="mt-2 text-white text-sm">Frictionless execution</div>
                                        </div>
                                        <div className="border border-white/10 bg-white/5 px-5 py-4">
                                            <div className="text-[10px] tracking-[0.26em] uppercase text-white/60">Care</div>
                                            <div className="mt-2 text-white text-sm">High-touch support</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F5F1EA] text-[#1a1a1a]">
                            <div className="max-w-6xl mx-auto px-6 py-12">{children}</div>

                            <div className="border-t border-black/10">
                                <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div>
                                        <div className="text-[10px] tracking-[0.28em] uppercase text-[#B78454]">Next step</div>
                                        <div className="mt-2 font-serif text-2xl">Talk to us — fast, direct, no friction.</div>
                                        <div className="mt-2 text-[#5E5E5E]">We respond quickly and keep it simple.</div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <a
                                            href="https://wa.me/34667640713"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="border border-black/10 bg-[#1a1a1a] text-white px-6 py-4 text-[10px] tracking-[0.26em] uppercase hover:bg-[#B78454] transition-colors"
                                        >
                                            WHATSAPP
                                        </a>
                                        <a
                                            href="mailto:lamaisonmexico@gmail.com"
                                            className="border border-black/10 bg-white px-6 py-4 text-[10px] tracking-[0.26em] uppercase hover:border-[#B78454]/50 transition-colors"
                                        >
                                            EMAIL
                                        </a>
                                        <button
                                            onClick={onClose}
                                            className="border border-black/10 bg-white px-6 py-4 text-[10px] tracking-[0.26em] uppercase hover:border-[#B78454]/50 transition-colors"
                                        >
                                            CLOSE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ---------------- App ----------------
export default function HomeMexicoSite() {
    const [navOpen, setNavOpen] = useState(false);
    const [lang, setLang] = useState<Lang>("en");
    const [scrolled, setScrolled] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);

    const [, setLocation] = useLocation();

    // Inquiry modal
    const [inquiry, setInquiry] = useState<Listing | null>(null);
    const [sending, setSending] = useState(false);

    // Cinematic overlays
    const [overlay, setOverlay] = useState<OverlayKey | null>(null);

    // Contact form state
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactMsg, setContactMsg] = useState("");

    // Inquiry modal state
    const [inqName, setInqName] = useState("");
    const [inqEmail, setInqEmail] = useState("");
    const [inqMsg, setInqMsg] = useState("");

    // Toasts
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const pushToast = (t: Omit<ToastItem, "id">) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setToasts((prev) => [{ id, ...t }, ...prev].slice(0, 4));
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3600);
    };
    const dismissToast = (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lenis Smooth Scroll
    useEffect(() => {
        if (!preloaderDone) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        } as any);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [preloaderDone]);

    // Scroll to hash if present
    useEffect(() => {
        if (!preloaderDone) return;
        const hash = window.location.hash?.replace("#", "");
        if (!hash) return;
        const el = document.getElementById(hash);
        if (!el) return;
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }, [preloaderDone]);

    const sections = useMemo(
        () => [
            { id: "home", label: copy[lang].nav.home, icon: <HomeIcon className="h-4 w-4" /> },
            { id: "who", label: copy[lang].nav.who, icon: <Info className="h-4 w-4" /> },
            { id: "properties", label: copy[lang].nav.properties, icon: <Info className="h-4 w-4" /> },
            { id: "lifestyle", label: copy[lang].nav.lifestyle, icon: <Utensils className="h-4 w-4" /> },
            { id: "contact", label: copy[lang].nav.contact, icon: <Phone className="h-4 w-4" /> },
        ],
        [lang]
    );

    const go = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setNavOpen(false);
    };

    const why = copy[lang].why;
    const lifestyle = copy[lang].lifestyle;
    const overlays = copy[lang].overlays;

    const overlayConfig = useMemo(() => {
        if (!overlay) return null;

        if (overlay === "locations") {
            return {
                title: overlays.locations.title,
                subtitle: overlays.locations.body,
                hero: BEACH_IMG,
                content: (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                        <div>
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#B78454]">Focus</div>
                            <h3 className="mt-3 font-serif text-3xl">Where we operate</h3>
                            <p className="mt-4 text-[#5E5E5E] leading-relaxed">
                                We focus on select areas where we can execute with real reliability: viewings, coordination, support, and local partners.
                            </p>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { h: "Riviera Maya", t: "Lifestyle markets with strong demand." },
                                    { h: "Yucatán", t: "City + countryside value & culture." },
                                    { h: "Mexico City", t: "Stable city anchor opportunities." },
                                    { h: "Local network", t: "Trusted vendors + partners." },
                                ].map((x) => (
                                    <div key={x.h} className="border border-black/10 bg-white p-5">
                                        <div className="flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-[#1a1a1a]">
                                            <CheckCircle2 className="h-4 w-4 text-[#B78454]" />
                                            {x.h}
                                        </div>
                                        <p className="mt-3 text-[#5E5E5E] leading-relaxed">{x.t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-black/10 bg-white p-6">
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">{overlays.locations.listTitle}</div>
                            <div className="mt-4 space-y-2">
                                {overlays.locations.list.map((x) => (
                                    <div key={x} className="flex items-center justify-between border border-black/10 bg-[#F5F1EA] px-4 py-3">
                                        <div className="font-serif text-lg">{x}</div>
                                        <ChevronRight className="h-4 w-4 text-black/40" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-black/10 pt-5">
                                <div className="text-xs tracking-[0.22em] uppercase text-[#B78454]">Tip</div>
                                <p className="mt-2 text-[#5E5E5E] leading-relaxed">
                                    Tell us your budget and target lifestyle. We’ll recommend the best-fit areas fast.
                                </p>
                            </div>
                        </div>
                    </div>
                ),
            };
        }

        if (overlay === "homecare") {
            return {
                title: overlays.homecare.title,
                subtitle: overlays.homecare.body,
                hero: INTERIOR_IMG,
                content: (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div>
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#B78454]">Home care</div>
                            <h3 className="mt-3 font-serif text-3xl">A–Z ownership support</h3>
                            <p className="mt-4 text-[#5E5E5E] leading-relaxed">
                                We build a simple, premium standard for your home—so it feels consistent whether you’re here or away.
                            </p>

                            <div className="mt-8 space-y-4">
                                {overlays.homecare.bullets.map((b) => (
                                    <div key={b.h} className="border border-black/10 bg-white p-5">
                                        <div className="text-xs tracking-[0.22em] uppercase text-[#B78454] flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            {b.h}
                                        </div>
                                        <p className="mt-3 text-[#5E5E5E] leading-relaxed">{b.t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-black/10 bg-white overflow-hidden">
                            <div className="relative h-[260px]">
                                <img {...safeImage(TEXTURE_IMG, HERO_FALLBACK)} alt="Texture" className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/0" />
                                <div className="absolute bottom-5 left-6 right-6 text-white">
                                    <div className="text-[10px] tracking-[0.28em] uppercase text-white/70">Standard</div>
                                    <div className="mt-2 font-serif text-2xl">Consistency, always</div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">What you get</div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        "Weekly / monthly checks",
                                        "Maintenance coordination",
                                        "Cleaning standards",
                                        "Vendor management",
                                        "Utility coordination",
                                        "Fast issue response",
                                    ].map((x) => (
                                        <div key={x} className="border border-black/10 bg-[#F5F1EA] px-4 py-3 text-sm text-[#1a1a1a] flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-[#B78454]" />
                                            {x}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t border-black/10 pt-5">
                                    <div className="text-xs tracking-[0.22em] uppercase text-[#B78454]">Note</div>
                                    <p className="mt-2 text-[#5E5E5E] leading-relaxed">
                                        We keep the experience premium and simple—no chaos, no guessing, no friction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ),
            };
        }

        return {
            title: overlays.about.title,
            subtitle: overlays.about.body,
            hero: CENOTE_IMG,
            content: (
                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
                    <div className="border border-black/10 bg-white overflow-hidden">
                        <div className="relative h-[320px]">
                            <img {...safeImage(HERO_PRIMARY, HERO_FALLBACK)} alt="LA MAISON" className="absolute inset-0 h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
                            <div className="absolute bottom-5 left-6 right-6 text-white">
                                <div className="text-[10px] tracking-[0.28em] uppercase text-white/70">LA MAISON</div>
                                <div className="mt-2 font-serif text-2xl">Boutique. Curated. Practical.</div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">Principles</div>
                            <div className="mt-4 space-y-2">
                                {[
                                    "Quality over quantity",
                                    "Local execution first",
                                    "Simple, direct process",
                                    "High-touch communication",
                                ].map((x) => (
                                    <div key={x} className="border border-black/10 bg-[#F5F1EA] px-4 py-3 text-sm text-[#1a1a1a] flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-[#B78454]" />
                                        {x}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] tracking-[0.28em] uppercase text-[#B78454]">Who we are</div>
                        <h3 className="mt-3 font-serif text-3xl">Luxury feel, real-world execution</h3>
                        <p className="mt-4 text-[#5E5E5E] leading-relaxed">
                            We focus on what matters: good homes, clean coordination, and an ownership experience that stays calm.
                        </p>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {overlays.about.bullets.map((b) => (
                                <div key={b.h} className="border border-black/10 bg-white p-5">
                                    <div className="text-xs tracking-[0.22em] uppercase text-[#B78454] flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {b.h}
                                    </div>
                                    <p className="mt-3 text-[#5E5E5E] leading-relaxed">{b.t}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 border border-black/10 bg-white p-6">
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">How we work</div>
                            <div className="mt-4 space-y-3">
                                {[
                                    { h: "1) Understand your target", t: "Lifestyle + budget + timeline." },
                                    { h: "2) Curate options", t: "Only properties that fit your intent." },
                                    { h: "3) Execute locally", t: "Viewings, partners, coordination." },
                                    { h: "4) Support ownership", t: "Setup + care + operations." },
                                ].map((x) => (
                                    <div key={x.h} className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-[#B78454]" />
                                        <div>
                                            <div className="font-medium text-[#1a1a1a]">{x.h}</div>
                                            <div className="text-[#5E5E5E]">{x.t}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            ),
        };
    }, [overlay, overlays]);

    return (
        <>
            <Preloader onComplete={() => setPreloaderDone(true)} />
            <ToastViewport toasts={toasts} onDismiss={dismissToast} />

            <div
                className={cn(
                    "relative min-h-screen bg-[#F5F1EA] text-[#2C2C2C] font-sans selection:bg-[#B78454] selection:text-white overflow-x-hidden",
                    !preloaderDone ? "h-screen overflow-hidden" : ""
                )}
            >
                <CustomCursor />
                <ScrollProgress />
                <NoiseOverlay />
                <ParticleField />
                <WhatsAppFixedButton />

                {/* Navigation */}
                <nav
                    className={cn(
                        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
                        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent text-white"
                    )}
                    style={scrolled ? { WebkitBackdropFilter: "blur(18px)", backdropFilter: "blur(18px)" } : undefined}
                >
                    <button onClick={() => go("home")} className="font-serif text-xl tracking-widest text-white mix-blend-difference">
                        LA MAISON
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-8">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => go(s.id)}
                                    className="text-xs tracking-[0.2em] font-medium transition-colors uppercase hover:text-[#B78454]"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium tracking-widest z-50">
                            <button
                                onClick={() => setLang("en")}
                                className={cn("px-2 py-1 transition-opacity", lang === "en" ? "opacity-100" : "opacity-50")}
                            >
                                EN
                            </button>
                            <span className="opacity-30">/</span>
                            <button
                                onClick={() => setLang("es")}
                                className={cn("px-2 py-1 transition-opacity", lang === "es" ? "opacity-100" : "opacity-50")}
                            >
                                ES
                            </button>
                        </div>

                        <button className="md:hidden z-50" onClick={() => setNavOpen(!navOpen)}>
                            {navOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <div className="space-y-1.5 w-6">
                                    <div className="h-0.5 bg-current w-full" />
                                    <div className="h-0.5 bg-current w-full" />
                                    <div className="h-0.5 bg-current w-full" />
                                </div>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {navOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed inset-0 z-40 bg-[#1a1a1a] text-[#F5F1EA] flex flex-col items-center justify-center gap-8 md:hidden"
                        >
                            {sections.map((s) => (
                                <button key={s.id} onClick={() => go(s.id)} className="text-2xl font-serif tracking-widest">
                                    {s.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero */}
                <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{ scale: 1.2 }}
                        animate={preloaderDone ? { scale: 1 } : { scale: 1.2 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        <img {...safeImage(HERO_PRIMARY, HERO_FALLBACK)} alt="Luxury Hacienda" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />
                    </motion.div>

                    <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        {preloaderDone && (
                            <>
                                <Reveal delay={0.2}>
                                    <p className="text-sm md:text-base tracking-[0.3em] font-light mb-6 opacity-90">MÉXICO</p>
                                </Reveal>

                                <div className="flex flex-col items-center">
                                    <SplitTitle text="LA MAISON" className="text-5xl md:text-7xl lg:text-8xl mb-6 font-serif" />
                                    <Reveal delay={0.45}>
                                        <div className="h-[2px] w-[12rem] md:w-[18rem] lg:w-[22rem] max-w-[80vw] bg-[#B78454]/95" />
                                    </Reveal>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Scroll -> PROPERTIES */}
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 cursor-pointer"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        onClick={() => go("properties")}
                    >
                        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                        <ArrowDown className="w-4 h-4 opacity-70" />
                    </motion.div>
                </section>

                {/* WHY INVEST */}
                <section id="who" className="relative py-32 bg-[#1a1a1a] text-[#F5F1EA] overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <img src={TEXTILE_IMG} className="w-full h-full object-cover grayscale opacity-50" alt="Texture" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                        <div className="w-full md:w-1/2">
                            <ClipRevealImage src={INTERIOR_IMG} fallback={HERO_FALLBACK} alt="Interior Design" className="aspect-[4/5]" />
                        </div>

                        <div className="w-full md:w-1/2 space-y-8">
                            <Reveal>
                                <span className="text-[#B78454] text-xs tracking-[0.2em] font-bold block mb-4">{why.label}</span>
                                <h2 className="text-4xl md:text-5xl font-serif leading-tight">{why.headline}</h2>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <p className="text-lg text-white/70 leading-relaxed font-light">{why.pitch}</p>
                            </Reveal>

                            <Reveal delay={0.3}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center gap-3">
                                            <Handshake className="h-4 w-4 text-[#B78454]" />
                                            <div className="text-[10px] tracking-[0.24em] uppercase">{why.trust.a.h}</div>
                                        </div>
                                        <div className="mt-2 text-sm text-white/70">{why.trust.a.t}</div>
                                    </div>
                                    <div className="border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 text-[#B78454]" />
                                            <div className="text-[10px] tracking-[0.24em] uppercase">{why.trust.b.h}</div>
                                        </div>
                                        <div className="mt-2 text-sm text-white/70">{why.trust.b.t}</div>
                                    </div>
                                    <div className="border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="h-4 w-4 text-[#B78454]" />
                                            <div className="text-[10px] tracking-[0.24em] uppercase">{why.trust.c.h}</div>
                                        </div>
                                        <div className="mt-2 text-sm text-white/70">{why.trust.c.t}</div>
                                    </div>
                                    <div className="border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center gap-3">
                                            <Languages className="h-4 w-4 text-[#B78454]" />
                                            <div className="text-[10px] tracking-[0.24em] uppercase">{why.trust.d.h}</div>
                                        </div>
                                        <div className="mt-2 text-sm text-white/70">{why.trust.d.t}</div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* PROPERTIES */}
                <PropertiesSection
                    id="properties"
                    lang={lang}
                    listings={LISTINGS}
                    onOpen={(l) => setLocation(`/properties/${l.id}`)}
                    onInquire={(l) => {
                        setInquiry(l);
                        setInqMsg("");
                    }}
                    onShare={async (l) => {
                        const r = await shareListing(l);
                        if (r === "copied") {
                            pushToast({ variant: "success", title: copy[lang].toast.copied, description: copy[lang].toast.copiedDesc });
                        }
                    }}
                />

                {/* LIFESTYLE */}
                <section id="lifestyle" className="py-24 bg-[#F5F1EA]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <Reveal>
                                <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6">{lifestyle.title}</h2>
                                <p className="text-[#5E5E5E] leading-relaxed">{lifestyle.subtitle}</p>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* LOCATIONS */}
                            <Reveal className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer" delay={0.05}>
                                <button type="button" onClick={() => setOverlay("locations")} className="absolute inset-0 z-20" aria-label="Open locations" />
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">{lifestyle.cards.locations.title}</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lifestyle.cards.locations.subtitle}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img src={BEACH_IMG} alt="Locations" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </Reveal>

                            {/* HOME CARE */}
                            <Reveal className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer" delay={0.15}>
                                <button type="button" onClick={() => setOverlay("homecare")} className="absolute inset-0 z-20" aria-label="Open home care" />
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">{lifestyle.cards.homecare.title}</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lifestyle.cards.homecare.subtitle}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img src={INTERIOR_IMG} alt="Home care" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </Reveal>

                            {/* ABOUT US */}
                            <Reveal className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer" delay={0.25}>
                                <button type="button" onClick={() => setOverlay("about")} className="absolute inset-0 z-20" aria-label="Open about us" />
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">{lifestyle.cards.about.title}</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lifestyle.cards.about.subtitle}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img src={CENOTE_IMG} alt="About us" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="relative py-24 bg-white">
                    <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none">
                        <img src={TEXTURE_IMG} className="w-full h-full object-cover" alt="Texture" />
                    </div>

                    <div className="container mx-auto px-6 max-w-4xl relative z-10">
                        <div className="text-center mb-16">
                            <Reveal>
                                <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-4">{copy[lang].contact.title}</h2>
                            </Reveal>
                        </div>

                        <Reveal delay={0.4}>
                            <Card className="border-none shadow-2xl shadow-black/5 bg-white overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/3 bg-[#1a1a1a] p-10 text-white flex flex-col justify-between">
                                        <div className="space-y-4 text-sm opacity-80 font-light">
                                            <p className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-[#B78454]" />
                                                By appointment
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-[#B78454]" />
                                                +34 667 640 713
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <Globe className="w-4 h-4 text-[#B78454]" />
                                                lamaisonmexico@gmail.com
                                            </p>
                                        </div>

                                        <div className="pt-12">
                                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                                                <Globe className="w-5 h-5 text-[#B78454]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-2/3 p-10">
                                        <form
                                            className="space-y-6"
                                            onSubmit={async (e) => {
                                                e.preventDefault();

                                                const name = contactName.trim();
                                                const email = contactEmail.trim();
                                                const message = contactMsg.trim();

                                                if (!name || !email || !message || !isValidEmail(email)) {
                                                    pushToast({ variant: "error", title: copy[lang].toast.invalid, description: copy[lang].toast.invalidDesc });
                                                    return;
                                                }

                                                try {
                                                    setSending(true);
                                                    pushToast({ variant: "info", title: copy[lang].toast.sending });

                                                    await sendInquiry({ name, email, message });

                                                    setContactName("");
                                                    setContactEmail("");
                                                    setContactMsg("");

                                                    pushToast({ variant: "success", title: copy[lang].toast.sent, description: copy[lang].toast.sentDesc });
                                                } catch (err: any) {
                                                    pushToast({ variant: "error", title: copy[lang].toast.error, description: err?.message || "Failed to send." });
                                                } finally {
                                                    setSending(false);
                                                }
                                            }}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">
                                                        {copy[lang].contact.name}
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={contactName}
                                                        onChange={(e) => setContactName(e.target.value)}
                                                        className="border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#B78454] bg-transparent"
                                                        placeholder="John Doe"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                                                        {copy[lang].contact.email}
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={contactEmail}
                                                        onChange={(e) => setContactEmail(e.target.value)}
                                                        className="border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#B78454] bg-transparent"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">
                                                    {copy[lang].contact.message}
                                                </Label>
                                                <textarea
                                                    id="message"
                                                    rows={4}
                                                    value={contactMsg}
                                                    onChange={(e) => setContactMsg(e.target.value)}
                                                    className="w-full border-0 border-b border-gray-200 rounded-none px-0 py-2 text-sm focus:outline-none focus:border-[#B78454] bg-transparent resize-none"
                                                    placeholder={lang === "en" ? "I'm interested in..." : "Me interesa..."}
                                                />
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={sending}
                                                    className="bg-[#1a1a1a] text-white hover:bg-[#B78454] rounded-none px-8 py-6 text-xs tracking-widest transition-colors duration-500"
                                                >
                                                    {sending ? (lang === "en" ? "SENDING..." : "ENVIANDO...") : copy[lang].contact.send}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        </Reveal>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#1a1a1a] text-white/40 py-12 px-6 border-t border-white/5">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs tracking-widest">© 2025 LA MAISON MEXICO</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors text-xs tracking-widest">INSTAGRAM</a>
                            <a href="#" className="hover:text-white transition-colors text-xs tracking-widest">LINKEDIN</a>
                        </div>
                    </div>
                </footer>

                {/* Inquiry Modal */}
                <AnimatePresence>
                    {inquiry && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setInquiry(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white max-w-lg w-full p-8 shadow-2xl relative"
                            >
                                <button onClick={() => setInquiry(null)} className="absolute top-4 right-4 text-black/50 hover:text-black transition-colors">
                                    <X className="w-6 h-6" />
                                </button>

                                <h3 className="font-serif text-2xl mb-2">{inquiry.title}</h3>
                                <p className="text-muted-foreground text-sm mb-6 uppercase tracking-wide">{inquiry.location}</p>

                                <form
                                    className="space-y-4"
                                    onSubmit={async (e) => {
                                        e.preventDefault();

                                        const name = inqName.trim();
                                        const email = inqEmail.trim();
                                        const message = (inqMsg || "").trim();

                                        if (!name || !email || !message || !isValidEmail(email)) {
                                            pushToast({ variant: "error", title: copy[lang].toast.invalid, description: copy[lang].toast.invalidDesc });
                                            return;
                                        }

                                        try {
                                            setSending(true);
                                            pushToast({ variant: "info", title: copy[lang].toast.sending });

                                            await sendInquiry({ name, email, message, listingId: inquiry.id, listingTitle: inquiry.title });

                                            setInquiry(null);
                                            setInqName("");
                                            setInqEmail("");
                                            setInqMsg("");

                                            pushToast({ variant: "success", title: copy[lang].toast.sent, description: copy[lang].toast.sentDesc });
                                        } catch (err: any) {
                                            pushToast({ variant: "error", title: copy[lang].toast.error, description: err?.message || "Failed to send." });
                                        } finally {
                                            setSending(false);
                                        }
                                    }}
                                >
                                    <Input value={inqName} onChange={(e) => setInqName(e.target.value)} placeholder={copy[lang].contact.name} className="rounded-none border-gray-300" />
                                    <Input value={inqEmail} onChange={(e) => setInqEmail(e.target.value)} placeholder={copy[lang].contact.email} className="rounded-none border-gray-300" />
                                    <textarea
                                        className="w-full border border-gray-300 rounded-none p-3 text-sm focus:outline-none focus:border-[#B78454]"
                                        rows={4}
                                        value={inqMsg}
                                        onChange={(e) => setInqMsg(e.target.value)}
                                        placeholder={lang === "en" ? `Message about ${inquiry.title}...` : `Mensaje sobre ${inquiry.title}...`}
                                    />
                                    <Button disabled={sending} className="w-full bg-[#1a1a1a] hover:bg-[#B78454] text-white rounded-none py-6 uppercase tracking-widest text-xs">
                                        {sending ? (lang === "en" ? "SENDING..." : "ENVIANDO...") : copy[lang].contact.send}
                                    </Button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Single cinematic overlay */}
                <CinematicOverlay
                    open={!!overlayConfig}
                    title={overlayConfig?.title || ""}
                    subtitle={overlayConfig?.subtitle || ""}
                    heroImage={overlayConfig?.hero || HERO_PRIMARY}
                    onClose={() => setOverlay(null)}
                >
                    {overlayConfig?.content}
                </CinematicOverlay>
            </div>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                                PROPERTIES                                  */
/* -------------------------------------------------------------------------- */

type RegionKey = "riviera" | "yucatan" | "cdmx" | "oaxaca" | "other";

function regionFromLocation(loc: string): RegionKey {
    const s = (loc || "").toLowerCase();

    // Riviera Maya
    if (s.includes("tulum") || s.includes("playa") || s.includes("canc")) return "riviera";

    // Yucatán region (including Campeche)
    if (s.includes("mérida") || s.includes("merida") || s.includes("yucat") || s.includes("campeche")) return "yucatan";

    // Mexico City
    if (s.includes("ciudad de méxico") || s.includes("mexico city") || s.includes("cdmx")) return "cdmx";

    // Oaxaca
    if (s.includes("oaxaca")) return "oaxaca";

    return "other";
}

type FiltersState = {
    priceMin: string;
    priceMax: string;
    bedsMin: string;
    bathsMin: string;
    areaMin: string;
    type: "any" | Listing["type"];
    regions: Record<RegionKey, boolean>;
};

function defaultFilters(): FiltersState {
    return {
        priceMin: "",
        priceMax: "",
        bedsMin: "",
        bathsMin: "",
        areaMin: "",
        type: "any",
        regions: { riviera: false, yucatan: false, cdmx: false, oaxaca: false, other: false },
    };
}

function FiltersDrawer({
                           open,
                           lang,
                           types,
                           availableRegions,
                           draft,
                           setDraft,
                           onClose,
                           onClear,
                           onApply,
                       }: {
    open: boolean;
    lang: Lang;
    types: Listing["type"][];
    availableRegions: Set<RegionKey>;
    draft: FiltersState;
    setDraft: React.Dispatch<React.SetStateAction<FiltersState>>;
    onClose: () => void;
    onClear: () => void;
    onApply: () => void;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const t = copy[lang].properties;

    const regionOptions: Array<{ key: RegionKey; label: string }> = [
        { key: "riviera", label: "Riviera Maya (Tulum / Playa / Cancún)" },
        { key: "yucatan", label: "Yucatán (Mérida / Campeche)" },
        { key: "cdmx", label: "Mexico City (CDMX)" },
        { key: "oaxaca", label: "Oaxaca" },
        { key: "other", label: "Other" },
    ];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-[#F5F1EA] border-l border-black/10 shadow-2xl overflow-auto"
                        initial={{ x: 24, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 24, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="p-6 border-b border-black/10 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] tracking-[0.28em] uppercase text-[#B78454]">LA MAISON</div>
                                <div className="mt-2 font-serif text-2xl">Filters</div>
                            </div>
                            <button onClick={onClose} className="text-black/50 hover:text-black transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.priceMin}</Label>
                                    <Input
                                        value={draft.priceMin}
                                        onChange={(e) => setDraft((p) => ({ ...p, priceMin: e.target.value }))}
                                        className="rounded-none border-gray-300 bg-white"
                                        inputMode="numeric"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.priceMax}</Label>
                                    <Input
                                        value={draft.priceMax}
                                        onChange={(e) => setDraft((p) => ({ ...p, priceMax: e.target.value }))}
                                        className="rounded-none border-gray-300 bg-white"
                                        inputMode="numeric"
                                        placeholder="1000000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.bedsMin}</Label>
                                    <Input
                                        value={draft.bedsMin}
                                        onChange={(e) => setDraft((p) => ({ ...p, bedsMin: e.target.value }))}
                                        className="rounded-none border-gray-300 bg-white"
                                        inputMode="numeric"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.bathsMin}</Label>
                                    <Input
                                        value={draft.bathsMin}
                                        onChange={(e) => setDraft((p) => ({ ...p, bathsMin: e.target.value }))}
                                        className="rounded-none border-gray-300 bg-white"
                                        inputMode="numeric"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.areaMin}</Label>
                                    <Input
                                        value={draft.areaMin}
                                        onChange={(e) => setDraft((p) => ({ ...p, areaMin: e.target.value }))}
                                        className="rounded-none border-gray-300 bg-white"
                                        inputMode="numeric"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.type}</Label>
                                <select
                                    value={draft.type}
                                    onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value as any }))}
                                    className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#B78454]"
                                >
                                    <option value="any">{t.any}</option>
                                    {types.map((x) => (
                                        <option key={x} value={x}>
                                            {x}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.regions}</Label>
                                <div className="grid grid-cols-1 gap-3">
                                    {regionOptions
                                        .filter((r) => availableRegions.has(r.key))
                                        .map((r) => (
                                            <label key={r.key} className="flex items-center gap-3 border border-black/10 bg-white px-4 py-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={draft.regions[r.key]}
                                                    onChange={(e) => setDraft((p) => ({ ...p, regions: { ...p.regions, [r.key]: e.target.checked } }))}
                                                />
                                                <span className="text-sm">{r.label}</span>
                                            </label>
                                        ))}
                                </div>
                                <div className="text-xs text-[#5E5E5E] leading-relaxed">
                                    Tip: Select multiple locations to broaden results.
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-black/10 flex items-center justify-between gap-3">
                            <button
                                onClick={onClear}
                                className="border border-black/10 bg-white px-6 py-4 text-[10px] tracking-[0.26em] uppercase hover:border-[#B78454]/50 transition-colors"
                            >
                                {t.clear}
                            </button>

                            <button
                                onClick={onApply}
                                className="border border-black/10 bg-[#1a1a1a] text-white px-6 py-4 text-[10px] tracking-[0.26em] uppercase hover:bg-[#B78454] transition-colors"
                            >
                                {t.apply}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function PropertiesSection({
                               id,
                               lang,
                               listings,
                               onOpen,
                               onInquire,
                               onShare,
                           }: {
    id: string;
    lang: Lang;
    listings: Listing[];
    onOpen: (l: Listing) => void;
    onInquire: (l: Listing) => void;
    onShare: (l: Listing) => void;
}) {
    const t = copy[lang].properties;

    const types = useMemo(() => {
        const s = new Set<Listing["type"]>();
        listings.forEach((l) => s.add(l.type));
        return Array.from(s).sort();
    }, [listings]);

    const availableRegions = useMemo(() => {
        const s = new Set<RegionKey>();
        listings.forEach((l) => s.add(regionFromLocation(l.location)));
        return s;
    }, [listings]);

    const [filters, setFilters] = useState<FiltersState>(defaultFilters());
    const [draft, setDraft] = useState<FiltersState>(defaultFilters());
    const [drawerOpen, setDrawerOpen] = useState(false);

    const filtered = useMemo(() => {
        const priceMin = toNum(filters.priceMin);
        const priceMax = toNum(filters.priceMax);
        const bedsMin = toNum(filters.bedsMin);
        const bathsMin = toNum(filters.bathsMin);
        const areaMin = toNum(filters.areaMin);

        const anyRegionSelected = Object.values(filters.regions).some(Boolean);
        const selectedRegions = Object.entries(filters.regions)
            .filter(([, v]) => v)
            .map(([k]) => k as RegionKey);

        return listings.filter((l) => {
            if (priceMin != null && l.priceUSD < priceMin) return false;
            if (priceMax != null && l.priceUSD > priceMax) return false;
            if (bedsMin != null && l.beds < bedsMin) return false;
            if (bathsMin != null && l.baths < bathsMin) return false;
            if (areaMin != null && l.areaM2 < areaMin) return false;

            if (filters.type !== "any" && l.type !== filters.type) return false;

            if (anyRegionSelected) {
                const r = regionFromLocation(l.location);
                if (!selectedRegions.includes(r)) return false;
            }

            return true;
        });
    }, [filters, listings]);

    const activeCount = useMemo(() => {
        let c = 0;
        if (filters.priceMin.trim()) c++;
        if (filters.priceMax.trim()) c++;
        if (filters.bedsMin.trim()) c++;
        if (filters.bathsMin.trim()) c++;
        if (filters.areaMin.trim()) c++;
        if (filters.type !== "any") c++;
        if (Object.values(filters.regions).some(Boolean)) c++;
        return c;
    }, [filters]);

    return (
        <section id={id} className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <Reveal>
                    <div className="mb-12 text-left md:text-center">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{t.title}</h2>

                        <div className="mt-4 flex items-center gap-3 md:justify-center">
                            <div className="h-[1px] w-14 bg-[#B78454]/90" />
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">{t.curated}</div>
                        </div>

                        <div className="mt-8 flex items-center justify-between md:justify-center md:gap-6 flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setDraft(filters);
                                    setDrawerOpen(true);
                                }}
                                className="border border-black/10 bg-white px-5 py-3 text-[10px] tracking-[0.26em] uppercase hover:border-[#B78454]/50 transition-colors flex items-center gap-2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                {t.openFilters}
                                {activeCount > 0 && (
                                    <span className="ml-2 border border-black/10 bg-[#F5F1EA] px-2 py-1 text-[10px] tracking-[0.26em]">
                    {activeCount}
                  </span>
                                )}
                            </button>

                            <div className="text-xs tracking-[0.14em] uppercase text-[#5E5E5E]">
                                {t.results}: <span className="text-[#1a1a1a] font-medium">{filtered.length}</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <div className="space-y-4">
                    {filtered.map((l, i) => (
                        <PropertyRow
                            key={l.id}
                            index={i}
                            l={l}
                            fallback={LISTING_IMAGES[(Number(l.id.split("-")[1]) + 1) % LISTING_IMAGES.length]}
                            lang={lang}
                            onOpen={() => onOpen(l)}
                            onInquire={() => onInquire(l)}
                            onShare={() => onShare(l)}
                        />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="mt-10 text-center text-sm text-[#5E5E5E]">{t.noMatch}</div>
                )}
            </div>

            <FiltersDrawer
                open={drawerOpen}
                lang={lang}
                types={types}
                availableRegions={availableRegions}
                draft={draft}
                setDraft={setDraft}
                onClose={() => setDrawerOpen(false)}
                onClear={() => setDraft(defaultFilters())}
                onApply={() => {
                    setFilters(draft);
                    setDrawerOpen(false);
                }}
            />
        </section>
    );
}

function PropertyRow({
                         l,
                         fallback,
                         lang,
                         index,
                         onOpen,
                         onInquire,
                         onShare,
                     }: {
    l: Listing;
    fallback: string;
    lang: Lang;
    index: number;
    onOpen: () => void;
    onInquire: () => void;
    onShare: () => void;
}) {
    return (
        <Reveal delay={index * 0.05}>
            <motion.div
                className="border border-black/10 bg-white overflow-hidden"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                    <button type="button" onClick={onOpen} className="relative h-[190px] md:h-full w-full overflow-hidden">
                        <motion.img
                            {...safeImage(l.image, fallback)}
                            alt={l.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                    </button>

                    <div className="p-6">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <div className="text-[10px] tracking-[0.26em] uppercase text-[#5E5E5E]">
                                    {l.type} • {l.id}
                                </div>
                                <button
                                    type="button"
                                    onClick={onOpen}
                                    className="mt-2 font-serif text-2xl text-[#1a1a1a] hover:text-[#B78454] transition-colors text-left"
                                >
                                    {l.title}
                                </button>
                                <div className="mt-2 flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#5E5E5E]">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {l.location}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-medium text-[#1a1a1a]">{formatUSD(l.priceUSD)}</div>
                                <div className="mt-2 h-[1px] w-14 bg-[#B78454]/70 ml-auto" />
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-[#5E5E5E] leading-relaxed line-clamp-2">{l.description[lang]}</div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4 text-xs text-[#5E5E5E]">
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" /> {l.beds}
                </span>
                                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" /> {l.baths}
                </span>
                                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" /> {l.areaM2} m²
                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={onShare}
                                    className="text-[10px] tracking-[0.26em] uppercase text-[#1a1a1a] hover:text-[#B78454] transition-colors flex items-center gap-2"
                                    title={lang === "en" ? "Share listing" : "Compartir propiedad"}
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    {copy[lang].properties.share}
                                </button>

                                <button
                                    type="button"
                                    onClick={onOpen}
                                    className="text-[10px] tracking-[0.26em] uppercase text-[#1a1a1a] hover:text-[#B78454] transition-colors"
                                >
                                    OPEN
                                </button>

                                <button
                                    type="button"
                                    onClick={onInquire}
                                    className="text-[10px] tracking-[0.26em] uppercase text-[#1a1a1a] hover:text-[#B78454] transition-colors"
                                >
                                    {copy[lang].properties.inquire}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Reveal>
    );
}
