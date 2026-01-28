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
    Search,
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
    Check,
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
// ⬇️ use a more fitting image for Home Care
import HOMECARE_IMG from "@assets/generated_images/minimalist_hacienda_interior.png";
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
        properties: { title: "PROPERTIES", inquire: "INQUIRE", share: "SHARE" },
        contact: { title: "CONTACT", send: "SEND MESSAGE", name: "Name", email: "Email", message: "Message" },

        why: {
            label: "WHY INVEST WITH US",
            headline: "Local execution. Global-level service.",
            pitch:
                "We help you buy, set up, and own property in Mexico with less friction—better decisions, faster timelines, and trusted on-the-ground support.",
        },

        lifestyle: {
            title: "Lifestyle",
            subtitle:
                "Click to explore where we operate, how we take care of your home, and what we do for buyers and owners.",
            cards: {
                locations: { title: "Locations", subtitle: "Where we operate" },
                homecare: { title: "Home Care", subtitle: "We handle it end-to-end" },
                about: { title: "About Us", subtitle: "Who we are & what we do" },
            },
        },

        overlays: {
            locations: {
                title: "Locations",
                kicker: "Where we operate",
                body:
                    "We operate across key areas in the Riviera Maya and Yucatán, with trusted local partners and on-the-ground execution.",
                listTitle: "Active areas",
                list: ["Playa del Carmen", "Tulum", "Cancún", "Mérida", "Countryside"],
            },
            homecare: {
                title: "Home Care (A–Z)",
                kicker: "Ownership made simple",
                body:
                    "From the moment you buy to the way the home lives day-to-day—our team coordinates everything so ownership feels effortless.",
                bullets: [
                    { h: "Design & Setup", t: "Layout direction, finishes, furnishing and staging—aligned with your home’s identity." },
                    { h: "Import & Logistics", t: "Sourcing, deliveries, customs coordination (when needed), and installation scheduling." },
                    { h: "Care While You’re Away", t: "Checks, cleaning, maintenance, small repairs, and trusted local coordination." },
                    { h: "Renting it Out", t: "Setup guidance + coordination—photos, turnover, and light operational support." },
                ],
            },
            about: {
                title: "About Us",
                kicker: "Boutique platform, real execution",
                body:
                    "LA MAISON is a boutique property platform focused on Mexico. We curate strong homes and support buyers and owners with practical, local execution.",
                bullets: [
                    { h: "Curated properties", t: "Homes selected for quality, location, and long-term value." },
                    { h: "Local execution", t: "We coordinate viewings, paperwork touchpoints, and trusted on-the-ground partners." },
                    { h: "Owner support", t: "Design, setup, care, and light operations so ownership stays frictionless." },
                ],
            },
        },

        filters: {
            title: "Filters",
            search: "Search",
            location: "Location",
            type: "Type",
            price: "Price (USD)",
            min: "Min",
            max: "Max",
            bedsMin: "Beds (min)",
            bathsMin: "Baths (min)",
            clear: "Clear",
            apply: "Apply",
            results: "Results",
            all: "All",
            noResults: "No matching properties. Try clearing filters.",
        },
    },

    es: {
        nav: { home: "INICIO", who: "POR QUÉ INVERTIR", properties: "PROPIEDADES", lifestyle: "ESTILO DE VIDA", contact: "CONTACTO" },
        properties: { title: "PROPIEDADES", inquire: "CONSULTAR", share: "COMPARTIR" },
        contact: { title: "CONTACTO", send: "ENVIAR MENSAJE", name: "Nombre", email: "Correo", message: "Mensaje" },

        why: {
            label: "POR QUÉ INVERTIR CON NOSOTROS",
            headline: "Ejecución local. Servicio de nivel global.",
            pitch:
                "Te ayudamos a comprar, preparar y gestionar propiedad en México con menos fricción—mejores decisiones, tiempos más rápidos y apoyo confiable en el terreno.",
        },

        lifestyle: {
            title: "Estilo de Vida",
            subtitle:
                "Haz clic para ver dónde operamos, cómo cuidamos tu casa y qué hacemos para compradores y propietarios.",
            cards: {
                locations: { title: "Ubicaciones", subtitle: "Dónde operamos" },
                homecare: { title: "Cuidado del Hogar", subtitle: "Lo gestionamos de principio a fin" },
                about: { title: "Sobre Nosotros", subtitle: "Quiénes somos y qué hacemos" },
            },
        },

        overlays: {
            locations: {
                title: "Ubicaciones",
                kicker: "Dónde operamos",
                body:
                    "Operamos en zonas clave de la Riviera Maya y Yucatán, con aliados locales y ejecución en el terreno.",
                listTitle: "Zonas activas",
                list: ["Playa del Carmen", "Tulum", "Cancún", "Mérida", "Zona rural"],
            },
            homecare: {
                title: "Cuidado del Hogar (A–Z)",
                kicker: "Propiedad sin fricción",
                body:
                    "Desde la compra hasta la operación del día a día—coordinamos todo para que ser propietario sea simple.",
                bullets: [
                    { h: "Diseño y Preparación", t: "Distribución, acabados, mobiliario y ambientación alineados con la identidad de tu hogar." },
                    { h: "Importación y Logística", t: "Compras, entregas, aduana (si aplica) y coordinación de instalación." },
                    { h: "Cuidado Cuando No Estás", t: "Revisiones, limpieza, mantenimiento, reparaciones menores y coordinación local." },
                    { h: "Renta", t: "Guía + coordinación—fotos, rotación y soporte operativo ligero." },
                ],
            },
            about: {
                title: "Sobre Nosotros",
                kicker: "Boutique + ejecución real",
                body:
                    "LA MAISON es una plataforma boutique enfocada en México. Curamos propiedades sólidas y apoyamos a compradores y propietarios con ejecución práctica y local.",
                bullets: [
                    { h: "Propiedades curadas", t: "Casas seleccionadas por calidad, ubicación y valor a largo plazo." },
                    { h: "Ejecución local", t: "Coordinamos visitas, puntos clave del papeleo y aliados confiables." },
                    { h: "Soporte al propietario", t: "Diseño, preparación, cuidado y operación ligera para minimizar fricción." },
                ],
            },
        },

        filters: {
            title: "Filtros",
            search: "Buscar",
            location: "Ubicación",
            type: "Tipo",
            price: "Precio (USD)",
            min: "Mín",
            max: "Máx",
            bedsMin: "Recámaras (mín)",
            bathsMin: "Baños (mín)",
            clear: "Limpiar",
            apply: "Aplicar",
            results: "Resultados",
            all: "Todos",
            noResults: "No hay propiedades que coincidan. Prueba limpiando filtros.",
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

async function sendInquiry(payload: { name: string; email: string; message: string; listingId?: string }) {
    const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to send inquiry");
    }
}

async function shareListing(listing: Listing) {
    const base = (import.meta as any).env?.BASE_URL ?? "/";
    const baseNorm = base.endsWith("/") ? base.slice(0, -1) : base;
    const url = `${window.location.origin}${baseNorm}/properties/${listing.id}`;
    const title = `${listing.title} — ${listing.id}`;
    const text = `${listing.title} (${listing.location})`;

    try {
        if (navigator.share) {
            await navigator.share({ title, text, url });
            return;
        }
    } catch {
        return;
    }

    try {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
    } catch {
        prompt("Copy this link:", url);
    }
}

type OverlayKey = "locations" | "homecare" | "about";

function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        const prevBody = document.body.style.overflow;
        const prevHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevBody;
            document.documentElement.style.overflow = prevHtml;
        };
    }, [locked]);
}

function FullPageOverlay({
                             open,
                             title,
                             kicker,
                             heroImage,
                             children,
                             onClose,
                         }: {
    open: boolean;
    title: string;
    kicker?: string;
    heroImage?: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    // lock scroll behind + prevent “scroll bleed”
    useBodyScrollLock(open);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // stop wheel/touch from reaching the page behind
                    onWheelCapture={(e) => e.stopPropagation()}
                    onTouchMoveCapture={(e) => e.stopPropagation()}
                    onClick={onClose}
                >
                    <motion.div
                        className="h-full w-full overflow-y-auto overscroll-contain"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 14 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="min-h-full px-4 sm:px-6 py-6 sm:py-10">
                            <div className="max-w-5xl mx-auto bg-[#F5F1EA] text-[#1a1a1a] border border-black/10 shadow-2xl overflow-hidden">
                                {/* sticky header for mobile so it never overlaps weirdly */}
                                <div className="sticky top-0 z-10 bg-[#F5F1EA] border-b border-black/10">
                                    <div className="flex items-center justify-between px-5 sm:px-6 py-4">
                                        <div>
                                            {kicker && <div className="text-[10px] tracking-[0.28em] uppercase text-[#B78454]">{kicker}</div>}
                                            <div className="font-serif text-xl sm:text-2xl">{title}</div>
                                        </div>
                                        <button onClick={onClose} className="text-black/60 hover:text-black transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {heroImage && (
                                    <div className="relative h-[220px] sm:h-[320px]">
                                        <img src={heroImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                        <div className="absolute bottom-4 left-5 sm:left-6 text-white">
                                            <div className="font-serif text-2xl sm:text-4xl">{title}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="px-5 sm:px-6 py-6 sm:py-10">{children}</div>
                            </div>

                            <div className="h-10" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

type FiltersState = {
    q: string;
    locations: string[]; // multi
    types: Listing["type"][]; // multi
    priceMin?: number;
    priceMax?: number;
    bedsMin?: number;
    bathsMin?: number;
};

function normalizeNumber(v: string): number | undefined {
    const n = Number(v);
    if (!Number.isFinite(n)) return undefined;
    return n;
}

function FiltersModal({
                          open,
                          lang,
                          locationsAll,
                          typesAll,
                          value,
                          onChange,
                          onClose,
                      }: {
    open: boolean;
    lang: Lang;
    locationsAll: string[];
    typesAll: Listing["type"][];
    value: FiltersState;
    onChange: (v: FiltersState) => void;
    onClose: () => void;
}) {
    useBodyScrollLock(open);

    const t = copy[lang].filters;

    // local draft so you can cancel
    const [draft, setDraft] = useState<FiltersState>(value);

    useEffect(() => {
        if (open) setDraft(value);
    }, [open, value]);

    const toggle = <T,>(arr: T[], item: T) => (arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);

    const clear = () =>
        setDraft({
            q: "",
            locations: [],
            types: [],
            priceMin: undefined,
            priceMax: undefined,
            bedsMin: undefined,
            bathsMin: undefined,
        });

    const apply = () => {
        onChange(draft);
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[85] bg-black/75 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    onWheelCapture={(e) => e.stopPropagation()}
                    onTouchMoveCapture={(e) => e.stopPropagation()}
                >
                    <motion.div
                        className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-6"
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 18, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full sm:max-w-3xl bg-[#F5F1EA] text-[#1a1a1a] border border-black/10 shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
                                <div className="font-serif text-xl">{t.title}</div>
                                <button onClick={onClose} className="text-black/60 hover:text-black">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="max-h-[70vh] overflow-y-auto overscroll-contain px-5 py-5">
                                {/* Search */}
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.search}</Label>
                                    <Input
                                        value={draft.q}
                                        onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
                                        className="rounded-none border-gray-300 bg-white"
                                        placeholder={lang === "en" ? "Mérida, Hacienda, Tulum..." : "Mérida, Hacienda, Tulum..."}
                                    />
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Locations */}
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.location}</div>
                                        <div className="space-y-2">
                                            {locationsAll.map((loc) => {
                                                const checked = draft.locations.includes(loc);
                                                return (
                                                    <button
                                                        key={loc}
                                                        type="button"
                                                        onClick={() => setDraft((d) => ({ ...d, locations: toggle(d.locations, loc) }))}
                                                        className={cn(
                                                            "w-full flex items-center justify-between border px-3 py-2 text-sm",
                                                            checked ? "border-[#B78454] bg-white" : "border-black/10 bg-white/70"
                                                        )}
                                                    >
                                                        <span className="text-left">{loc}</span>
                                                        {checked && <Check className="w-4 h-4 text-[#B78454]" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Types */}
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.type}</div>
                                        <div className="space-y-2">
                                            {typesAll.map((tp) => {
                                                const checked = draft.types.includes(tp);
                                                return (
                                                    <button
                                                        key={tp}
                                                        type="button"
                                                        onClick={() => setDraft((d) => ({ ...d, types: toggle(d.types, tp) }))}
                                                        className={cn(
                                                            "w-full flex items-center justify-between border px-3 py-2 text-sm",
                                                            checked ? "border-[#B78454] bg-white" : "border-black/10 bg-white/70"
                                                        )}
                                                    >
                                                        <span>{tp}</span>
                                                        {checked && <Check className="w-4 h-4 text-[#B78454]" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Price range */}
                                <div className="mt-6">
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.price}</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.min}</Label>
                                            <Input
                                                inputMode="numeric"
                                                value={draft.priceMin ?? ""}
                                                onChange={(e) => setDraft((d) => ({ ...d, priceMin: normalizeNumber(e.target.value) }))}
                                                className="rounded-none border-gray-300 bg-white"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.max}</Label>
                                            <Input
                                                inputMode="numeric"
                                                value={draft.priceMax ?? ""}
                                                onChange={(e) => setDraft((d) => ({ ...d, priceMax: normalizeNumber(e.target.value) }))}
                                                className="rounded-none border-gray-300 bg-white"
                                                placeholder="1000000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Beds/Baths */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.bedsMin}</Label>
                                        <Input
                                            inputMode="numeric"
                                            value={draft.bedsMin ?? ""}
                                            onChange={(e) => setDraft((d) => ({ ...d, bedsMin: normalizeNumber(e.target.value) }))}
                                            className="rounded-none border-gray-300 bg-white"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t.bathsMin}</Label>
                                        <Input
                                            inputMode="numeric"
                                            value={draft.bathsMin ?? ""}
                                            onChange={(e) => setDraft((d) => ({ ...d, bathsMin: normalizeNumber(e.target.value) }))}
                                            className="rounded-none border-gray-300 bg-white"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="h-4" />
                            </div>

                            <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-black/10 bg-[#F5F1EA]">
                                <Button type="button" onClick={clear} className="rounded-none bg-transparent text-black border border-black/15 hover:bg-black/5">
                                    {t.clear}
                                </Button>
                                <Button type="button" onClick={apply} className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white">
                                    {t.apply}
                                </Button>
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

    // Full-page overlays
    const [overlay, setOverlay] = useState<OverlayKey | null>(null);

    // Filters
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<FiltersState>({
        q: "",
        locations: [],
        types: [],
        priceMin: undefined,
        priceMax: undefined,
        bedsMin: undefined,
        bathsMin: undefined,
    });

    // Contact form state
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactMsg, setContactMsg] = useState("");

    // Inquiry modal state
    const [inqName, setInqName] = useState("");
    const [inqEmail, setInqEmail] = useState("");
    const [inqMsg, setInqMsg] = useState("");

    // Prevent “jump to properties” if a hash is stuck in the URL
    useEffect(() => {
        // clear hash without reloading
        if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
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

    // lock body scroll when any modal/overlay/menu is open
    const anyModalOpen = Boolean(overlay) || Boolean(inquiry) || navOpen || filtersOpen;
    useBodyScrollLock(anyModalOpen);

    const sections = useMemo(
        () => [
            { id: "home", label: copy[lang].nav.home, icon: <HomeIcon className="h-4 w-4" /> },
            { id: "who", label: copy[lang].nav.who, icon: <Info className="h-4 w-4" /> },
            { id: "properties", label: copy[lang].nav.properties, icon: <Search className="h-4 w-4" /> },
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
    const tf = copy[lang].filters;

    const locationsAll = useMemo(() => Array.from(new Set(LISTINGS.map((l) => l.location))).sort(), []);
    const typesAll = useMemo(() => Array.from(new Set(LISTINGS.map((l) => l.type))) as Listing["type"][], []);

    const filteredListings = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const locSet = new Set(filters.locations);
        const typeSet = new Set(filters.types);

        return LISTINGS.filter((l) => {
            if (q) {
                const hay = `${l.title} ${l.location} ${l.type} ${l.id} ${l.description.en} ${l.description.es}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (locSet.size > 0 && !locSet.has(l.location)) return false;
            if (typeSet.size > 0 && !typeSet.has(l.type)) return false;

            if (typeof filters.priceMin === "number" && l.priceUSD < filters.priceMin) return false;
            if (typeof filters.priceMax === "number" && l.priceUSD > filters.priceMax) return false;

            if (typeof filters.bedsMin === "number" && l.beds < filters.bedsMin) return false;
            if (typeof filters.bathsMin === "number" && l.baths < filters.bathsMin) return false;

            return true;
        });
    }, [filters]);

    const activeFiltersCount = useMemo(() => {
        let c = 0;
        if (filters.q.trim()) c++;
        if (filters.locations.length) c++;
        if (filters.types.length) c++;
        if (typeof filters.priceMin === "number") c++;
        if (typeof filters.priceMax === "number") c++;
        if (typeof filters.bedsMin === "number") c++;
        if (typeof filters.bathsMin === "number") c++;
        return c;
    }, [filters]);

    return (
        <>
            <Preloader onComplete={() => setPreloaderDone(true)} />

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
                    style={
                        scrolled
                            ? { WebkitBackdropFilter: "blur(18px)", backdropFilter: "blur(18px)" }
                            : undefined
                    }
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
                            <button onClick={() => setLang("en")} className={cn("px-2 py-1 transition-opacity", lang === "en" ? "opacity-100" : "opacity-50")}>
                                EN
                            </button>
                            <span className="opacity-30">/</span>
                            <button onClick={() => setLang("es")} className={cn("px-2 py-1 transition-opacity", lang === "es" ? "opacity-100" : "opacity-50")}>
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
                            onClick={() => setNavOpen(false)}
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

                    {/* Scroll arrow goes to PROPERTIES (not why) */}
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
                        </div>
                    </div>
                </section>

                {/* PROPERTIES */}
                <PropertiesSection
                    id="properties"
                    lang={lang}
                    listings={filteredListings}
                    totalCount={LISTINGS.length}
                    activeCount={filteredListings.length}
                    activeFiltersCount={activeFiltersCount}
                    onOpenFilters={() => setFiltersOpen(true)}
                    onOpen={(l) => setLocation(`/properties/${l.id}`)}
                    onInquire={(l) => {
                        setInquiry(l);
                        setInqMsg("");
                    }}
                    onShare={(l) => shareListing(l)}
                />

                <FiltersModal
                    open={filtersOpen}
                    lang={lang}
                    locationsAll={locationsAll}
                    typesAll={typesAll}
                    value={filters}
                    onChange={setFilters}
                    onClose={() => setFiltersOpen(false)}
                />

                {/* LIFESTYLE (3 clickable cards) */}
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
                                <motion.img src={HOMECARE_IMG} alt="Home Care" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </Reveal>

                            {/* ABOUT */}
                            <Reveal className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer" delay={0.25}>
                                <button type="button" onClick={() => setOverlay("about")} className="absolute inset-0 z-20" aria-label="Open about us" />
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">{lifestyle.cards.about.title}</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lifestyle.cards.about.subtitle}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img src={CENOTE_IMG} alt="About Us" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                                                try {
                                                    setSending(true);
                                                    await sendInquiry({
                                                        name: contactName.trim(),
                                                        email: contactEmail.trim(),
                                                        message: contactMsg.trim(),
                                                    });
                                                    setContactMsg("");
                                                    alert(lang === "en" ? "Sent! We'll get back to you soon." : "¡Enviado! Te contactaremos pronto.");
                                                } catch (err: any) {
                                                    alert(err?.message || (lang === "en" ? "Failed to send. Please try again." : "No se pudo enviar. Intenta de nuevo."));
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
                            <a href="#" className="hover:text-white transition-colors text-xs tracking-widest">
                                INSTAGRAM
                            </a>
                            <a href="#" className="hover:text-white transition-colors text-xs tracking-widest">
                                LINKEDIN
                            </a>
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
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setInquiry(null)}
                            onWheelCapture={(e) => e.stopPropagation()}
                            onTouchMoveCapture={(e) => e.stopPropagation()}
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
                                        try {
                                            setSending(true);
                                            await sendInquiry({
                                                name: inqName.trim(),
                                                email: inqEmail.trim(),
                                                message: (inqMsg || "").trim(),
                                                listingId: inquiry.id,
                                            });
                                            setInquiry(null);
                                            setInqMsg("");
                                            alert(lang === "en" ? "Sent! We'll get back to you soon." : "¡Enviado! Te contactaremos pronto.");
                                        } catch (err: any) {
                                            alert(err?.message || (lang === "en" ? "Failed to send. Please try again." : "No se pudo enviar. Intenta de nuevo."));
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

                {/* Full-page overlays */}
                <FullPageOverlay
                    open={overlay === "locations"}
                    title={overlays.locations.title}
                    kicker={overlays.locations.kicker}
                    heroImage={BEACH_IMG}
                    onClose={() => setOverlay(null)}
                >
                    <p className="text-[#5E5E5E] leading-relaxed text-base sm:text-lg">{overlays.locations.body}</p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {overlays.locations.list.map((x) => (
                            <div key={x} className="border border-black/10 bg-white p-5">
                                <div className="text-[10px] tracking-[0.26em] uppercase text-[#B78454]">{overlays.locations.listTitle}</div>
                                <div className="mt-2 font-serif text-xl">{x}</div>
                                <div className="mt-2 text-[#5E5E5E] text-sm leading-relaxed">
                                    {lang === "en" ? "Local partners, viewings, setup, and ongoing support available." : "Aliados locales, visitas, preparación y soporte continuo disponible."}
                                </div>
                            </div>
                        ))}
                    </div>
                </FullPageOverlay>

                <FullPageOverlay
                    open={overlay === "homecare"}
                    title={overlays.homecare.title}
                    kicker={overlays.homecare.kicker}
                    heroImage={HOMECARE_IMG}
                    onClose={() => setOverlay(null)}
                >
                    <p className="text-[#5E5E5E] leading-relaxed text-base sm:text-lg">{overlays.homecare.body}</p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {overlays.homecare.bullets.map((b) => (
                            <div key={b.h} className="border border-black/10 bg-white p-5">
                                <div className="text-xs tracking-[0.22em] uppercase text-[#B78454]">{b.h}</div>
                                <p className="mt-3 text-[#5E5E5E] leading-relaxed">{b.t}</p>
                            </div>
                        ))}
                    </div>
                </FullPageOverlay>

                <FullPageOverlay
                    open={overlay === "about"}
                    title={overlays.about.title}
                    kicker={overlays.about.kicker}
                    heroImage={CENOTE_IMG}
                    onClose={() => setOverlay(null)}
                >
                    <p className="text-[#5E5E5E] leading-relaxed text-base sm:text-lg">{overlays.about.body}</p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {overlays.about.bullets.map((b) => (
                            <div key={b.h} className="border border-black/10 bg-white p-5">
                                <div className="text-xs tracking-[0.22em] uppercase text-[#B78454]">{b.h}</div>
                                <p className="mt-3 text-[#5E5E5E] leading-relaxed">{b.t}</p>
                            </div>
                        ))}
                    </div>
                </FullPageOverlay>
            </div>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                                PROPERTIES                                  */
/* -------------------------------------------------------------------------- */

function PropertiesSection({
                               id,
                               lang,
                               listings,
                               totalCount,
                               activeCount,
                               activeFiltersCount,
                               onOpenFilters,
                               onOpen,
                               onInquire,
                               onShare,
                           }: {
    id: string;
    lang: Lang;
    listings: Listing[];
    totalCount: number;
    activeCount: number;
    activeFiltersCount: number;
    onOpenFilters: () => void;
    onOpen: (l: Listing) => void;
    onInquire: (l: Listing) => void;
    onShare: (l: Listing) => void;
}) {
    return (
        <section id={id} className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <Reveal>
                    <div className="mb-8 text-left md:text-center">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{copy[lang].properties.title}</h2>
                        <div className="mt-4 flex items-center gap-3 md:justify-center">
                            <div className="h-[1px] w-14 bg-[#B78454]/90" />
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">
                                {lang === "en" ? "Curated selection" : "Selección curada"}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center md:justify-center gap-4">
                            <button
                                type="button"
                                onClick={onOpenFilters}
                                className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-3 text-[10px] tracking-[0.26em] uppercase hover:border-[#B78454] transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {copy[lang].filters.title}
                                {activeFiltersCount > 0 && (
                                    <span className="ml-2 rounded-full bg-[#B78454] text-white px-2 py-0.5 text-[10px] tracking-normal">
                    {activeFiltersCount}
                  </span>
                                )}
                            </button>

                            <div className="text-[10px] tracking-[0.26em] uppercase text-[#5E5E5E]">
                                {copy[lang].filters.results}:{" "}
                                <span className="text-[#1a1a1a]">{activeCount}</span>
                                <span className="opacity-50"> / {totalCount}</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {listings.length === 0 ? (
                    <div className="border border-black/10 bg-[#F5F1EA] p-8 text-center">
                        <div className="font-serif text-2xl text-[#1a1a1a]">{copy[lang].filters.noResults}</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listings.map((l, i) => (
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
                )}
            </div>
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
