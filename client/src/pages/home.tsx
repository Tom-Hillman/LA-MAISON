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
    ChevronRight,
    ChevronLeft,
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
} from "lucide-react";
import Lenis from "lenis";

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
import DINING_IMG from "@assets/generated_images/mexican_fine_dining_detail.png";
import TEXTILE_IMG from "@assets/generated_images/artisanal_mexican_textiles.png";

// ---------------- Images ----------------
const HERO_PRIMARY = HERO_PRIMARY_IMG;
const HERO_FALLBACK =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80";

const LISTING_IMAGES = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
];

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

// ---------------- Brand mark: “La Maison” with L and N 25% larger ----------------


// ---------------- Data ----------------
type Listing = {
    id: string;
    title: string;
    location: string;
    priceUSD: number;
    beds: number;
    baths: number;
    areaM2: number;
    type: "Hacienda" | "Villa" | "Casa" | "Condo";
    image: string;
    photos: string[];
    description: { en: string; es: string };
};

const LISTINGS: Listing[] = [
    {
        id: "LM-001",
        title: "Hacienda Santa Luna",
        location: "Mérida, Yucatán",
        priceUSD: 625000,
        beds: 4,
        baths: 4,
        areaM2: 420,
        type: "Hacienda",
        image: LISTING_IMAGES[4],
        photos: [LISTING_IMAGES[4], LISTING_IMAGES[4], LISTING_IMAGES[6], LISTING_IMAGES[7]],
        description: {
            en: "Courtyard-centered hacienda with double-height living, hand-finished plaster, and warm quiet light throughout.",
            es: "Hacienda con patio central, sala de doble altura, estuco artesanal y una luz cálida y tranquila.",
        },
    },
    {
        id: "LM-003",
        title: "Villa Agave Verde",
        location: "Tulum, Quintana Roo",
        priceUSD: 399000,
        beds: 2,
        baths: 2,
        areaM2: 180,
        type: "Villa",
        image: LISTING_IMAGES[2],
        photos: [LISTING_IMAGES[2], LISTING_IMAGES[7], LISTING_IMAGES[0], LISTING_IMAGES[6]],
        description: {
            en: "Modern tropical villa designed for privacy—clean lines, shaded terraces, and a strong short-term rental flow.",
            es: "Villa tropical moderna diseñada para privacidad—líneas limpias, terrazas sombreadas y buena renta vacacional.",
        },
    },
    {
        id: "LM-004",
        title: "Departamento Centro Histórico",
        location: "Ciudad de México",
        priceUSD: 265000,
        beds: 2,
        baths: 1,
        areaM2: 92,
        type: "Condo",
        image: LISTING_IMAGES[3],
        photos: [LISTING_IMAGES[3], LISTING_IMAGES[1], LISTING_IMAGES[5], LISTING_IMAGES[6]],
        description: {
            en: "A walkable central base with timeless materials and practical proportions—ideal as a stable city anchor.",
            es: "Base céntrica y caminable con materiales atemporales y proporciones prácticas—ideal como activo urbano.",
        },
    },
    {
        id: "LM-005",
        title: "Hacienda del Sol",
        location: "Campeche, Campeche",
        priceUSD: 755000,
        beds: 5,
        baths: 5,
        areaM2: 520,
        type: "Hacienda",
        image: LISTING_IMAGES[4],
        photos: [LISTING_IMAGES[4], LISTING_IMAGES[0], LISTING_IMAGES[2], LISTING_IMAGES[7]],
        description: {
            en: "Grand-scale entertaining with generous indoor-outdoor rhythm—an architectural statement with warmth.",
            es: "Escala generosa para recibir con ritmo interior-exterior—una propiedad icónica con calidez.",
        },
    },
    {
        id: "LM-006",
        title: "Casa Patio de Crema",
        location: "Oaxaca, Oaxaca",
        priceUSD: 315000,
        beds: 2,
        baths: 2,
        areaM2: 165,
        type: "Casa",
        image: LISTING_IMAGES[5],
        photos: [LISTING_IMAGES[5], LISTING_IMAGES[6], LISTING_IMAGES[3], LISTING_IMAGES[1]],
        description: {
            en: "Warm tones, compact courtyard mood, and a slow-living feel—perfect for culture-forward buyers.",
            es: "Tonos cálidos, ambiente de patio y sensación de vida lenta—ideal para compradores amantes de la cultura.",
        },
    },
];

const formatUSD = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// ---------------- i18n ----------------
type Lang = "en" | "es";
const copy = {
    en: {
        nav: { home: "HOME", who: "PHILOSOPHY", properties: "PROPERTIES", lifestyle: "LIFESTYLE", contact: "CONTACT" },
        properties: { title: "PROPERTIES", inquire: "INQUIRE" },
        contact: { title: "CONTACT", send: "SEND MESSAGE", name: "Name", email: "Email", message: "Message" },
    },
    es: {
        nav: { home: "INICIO", who: "FILOSOFÍA", properties: "PROPIEDADES", lifestyle: "ESTILO DE VIDA", contact: "CONTACTO" },
        properties: { title: "PROPIEDADES", inquire: "CONSULTAR" },
        contact: { title: "CONTACTO", send: "ENVIAR MENSAJE", name: "Nombre", email: "Correo", message: "Mensaje" },
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
                        <div className="text-3xl md:text-5xl">
                            <div className="font-serif tracking-[0.2em] text-3xl md:text-5xl">
                                LA MAISON
                            </div>

                        </div>
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

// ---------------- Custom cursor (kept; no jiggle effects) ----------------
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

// ---------------- WhatsApp button (unchanged here) ----------------
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
            WHATSAPP
        </motion.a>
    );
}

// ---------------- App ----------------
export default function HomeMexicoSite() {
    const [navOpen, setNavOpen] = useState(false);
    const [lang, setLang] = useState<Lang>("en");
    const [scrolled, setScrolled] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);

    // Modals
    const [gallery, setGallery] = useState<{ listing: Listing; idx: number } | null>(null);
    const [inquiry, setInquiry] = useState<Listing | null>(null);

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

                {/* Navigation (transparent -> cloudy glassy on scroll) */}
                <nav
                    className={cn(
                        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
                        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent text-white"
                    )}
                    style={
                        scrolled
                            ? {
                                // subtle “cloud” feel
                                WebkitBackdropFilter: "blur(18px)",
                                backdropFilter: "blur(18px)",
                            }
                            : undefined
                    }
                >
                    <button
                        onClick={() => go("home")}
                        className="font-serif text-xl tracking-widest text-white mix-blend-difference"
                    >
                        LA MAISON
                    </button>

                    <button onClick={() => go("home")}
                            className="text-xl font-serif tracking-widest font-bold z-50 relative">
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-8">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => go(s.id)}
                                    className={cn(
                                        "text-xs tracking-[0.2em] font-medium transition-colors uppercase",
                                        scrolled ? "hover:text-[#B78454]" : "hover:text-[#B78454]"
                                    )}
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

                        {/* Mobile Menu Button */}
                        <button className="md:hidden z-50" onClick={() => setNavOpen(!navOpen)}>
                            {navOpen ? (
                                <X className="w-6 h-6"/>
                            ) : (
                                <div className="space-y-1.5 w-6">
                                    <div className="h-0.5 bg-current w-full"/>
                                    <div className="h-0.5 bg-current w-full"/>
                                    <div className="h-0.5 bg-current w-full"/>
                                </div>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Overlay */}
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

                {/* Hero Section */}
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
                                        {/* Golden line: slightly shorter (roughly A -> O) and a bit thicker */}
                                        <div className="h-[2px] w-[12rem] md:w-[18rem] lg:w-[22rem] max-w-[80vw] bg-[#B78454]/95" />
                                    </Reveal>
                                </div>
                            </>
                        )}
                    </div>

                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 cursor-pointer"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        onClick={() => go("who")}
                    >
                        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                        <ArrowDown className="w-4 h-4 opacity-70" />
                    </motion.div>
                </section>

                {/* OUR PHILOSOPHY */}
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
                                <span className="text-[#B78454] text-xs tracking-[0.2em] font-bold block mb-4">THE PHILOSOPHY</span>
                                <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                                    {lang === "en" ? "Architecture grounded in nature." : "Arquitectura arraigada en la naturaleza."}
                                </h2>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <p className="text-lg text-white/70 leading-relaxed font-light">
                                    {lang === "en"
                                        ? "Every property in our collection is chosen for its dialogue with the environment. We look for spaces where light, air, and material converge to create a sensory experience. We honor the heritage of Mexican craftsmanship while embracing contemporary living."
                                        : "Cada propiedad en nuestra colección es elegida por su diálogo con el entorno. Buscamos espacios donde la luz, el aire y el material convergen para crear una experiencia sensorial. Honramos la herencia de la artesanía mexicana mientras abrazamos la vida contemporánea."}
                                </p>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                    <div>
                                        <h3 className="text-2xl font-serif mb-2">15+</h3>
                                        <p className="text-xs tracking-widest text-white/50">YEARS EXPERIENCE</p>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif mb-2">$120M+</h3>
                                        <p className="text-xs tracking-widest text-white/50">SOLD INVENTORY</p>
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
                    onOpen={(l) => setGallery({ listing: l, idx: 0 })}
                    onInquire={(l) => setInquiry(l)}
                />

                {/* Lifestyle / Locations Grid (unchanged) */}
                <section id="lifestyle" className="py-24 bg-[#F5F1EA]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <Reveal>
                                <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6">
                                    {lang === "en" ? "Destinations" : "Destinos"}
                                </h2>
                                <p className="text-[#5E5E5E] leading-relaxed">
                                    {lang === "en"
                                        ? "From the mystical cenotes of the Yucatán to the pristine beaches of Tulum, our properties are located in the most culturally rich and visually stunning regions of Mexico."
                                        : "Desde los místicos cenotes de Yucatán hasta las playas vírgenes de Tulum, nuestras propiedades están ubicadas en las regiones más ricas culturalmente y visualmente impresionantes de México."}
                                </p>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Reveal className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer">
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">Yucatán</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lang === "en" ? "Ancient Culture & Cenotes" : "Cultura Antigua y Cenotes"}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img
                                    src={CENOTE_IMG}
                                    alt="Cenote"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Reveal>

                            <Reveal delay={0.2} className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer">
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">Tulum</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lang === "en" ? "Caribbean Coast & Nightlife" : "Costa Caribeña y Vida Nocturna"}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img
                                    src={BEACH_IMG}
                                    alt="Tulum"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <Reveal delay={0.3} className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer">
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">Gastronomy</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lang === "en" ? "World-Class Culinary Scene" : "Escena Culinaria de Clase Mundial"}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                                <motion.img
                                    src={DINING_IMG}
                                    alt="Dining"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Reveal>

                            <div className="bg-[#1a1a1a] text-white p-12 flex flex-col justify-center items-center text-center">
                                <Reveal delay={0.4}>
                                    <Globe className="w-12 h-12 text-[#B78454] mb-6 mx-auto" />
                                    <h3 className="text-2xl font-serif mb-4">{lang === "en" ? "Global Access" : "Acceso Global"}</h3>
                                    <p className="text-white/60 leading-relaxed mb-8">
                                        {lang === "en"
                                            ? "With international airports in Cancún, Mérida, and Tulum, your tropical sanctuary is just a flight away from major global hubs."
                                            : "Con aeropuertos internacionales en Cancún, Mérida y Tulum, su santuario tropical está a solo un vuelo de los principales centros globales."}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white hover:text-black rounded-none uppercase tracking-widest text-xs py-6 px-8"
                                    >
                                        {lang === "en" ? "Learn More" : "Saber Más"}
                                    </Button>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section (logo sizing applied) */}
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
                                        <div>
                                            <div className="text-2xl mb-6">
                                            </div>
                                            <div className="space-y-4 text-sm opacity-80 font-light">
                                                <p className="flex items-center gap-3">
                                                    <MapPin className="w-4 h-4 text-[#B78454]" />
                                                    Paseo de Montejo 498
                                                    <br />
                                                    Mérida, Yuc. México
                                                </p>
                                                <p className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-[#B78454]" />
                                                    +52 (999) 123 4567
                                                </p>
                                                <p className="flex items-center gap-3">
                                                    <Globe className="w-4 h-4 text-[#B78454]" />
                                                    hello@lamaison.mx
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-12">
                                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                                                <Globe className="w-5 h-5 text-[#B78454]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-2/3 p-10">
                                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">
                                                        {copy[lang].contact.name}
                                                    </Label>
                                                    <Input
                                                        id="name"
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
                                                    className="w-full border-0 border-b border-gray-200 rounded-none px-0 py-2 text-sm focus:outline-none focus:border-[#B78454] bg-transparent resize-none"
                                                    placeholder={lang === "en" ? "I'm interested in..." : "Me interesa..."}
                                                />
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <Button
                                                    type="submit"
                                                    className="bg-[#1a1a1a] text-white hover:bg-[#B78454] rounded-none px-8 py-6 text-xs tracking-widest transition-colors duration-500"
                                                >
                                                    {copy[lang].contact.send}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        </Reveal>
                    </div>
                </section>

                {/* Footer (logo sizing applied) */}
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

                {/* Modals */}
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

                                <div className="space-y-4">
                                    <Input placeholder={copy[lang].contact.name} className="rounded-none border-gray-300" />
                                    <Input placeholder={copy[lang].contact.email} className="rounded-none border-gray-300" />
                                    <textarea
                                        className="w-full border border-gray-300 rounded-none p-3 text-sm focus:outline-none focus:border-[#B78454]"
                                        rows={4}
                                        placeholder={`${copy[lang].contact.message} regarding ${inquiry.title}...`}
                                    />
                                    <Button className="w-full bg-[#1a1a1a] hover:bg-[#B78454] text-white rounded-none py-6 uppercase tracking-widest text-xs">
                                        {copy[lang].contact.send}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {gallery && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center"
                            onClick={() => setGallery(null)}
                        >
                            <button onClick={() => setGallery(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50">
                                <X className="w-8 h-8" />
                            </button>

                            <div className="w-full max-w-6xl px-6 h-[80vh] flex items-center justify-center relative">
                                <motion.img
                                    key={gallery.idx}
                                    src={gallery.listing.photos[gallery.idx]}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="max-w-full max-h-full object-contain"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <button
                                    className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newIdx = gallery.idx === 0 ? gallery.listing.photos.length - 1 : gallery.idx - 1;
                                        setGallery({ ...gallery, idx: newIdx });
                                    }}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>

                                <button
                                    className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newIdx = (gallery.idx + 1) % gallery.listing.photos.length;
                                        setGallery({ ...gallery, idx: newIdx });
                                    }}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="absolute bottom-8 left-0 right-0 text-center">
                                <h3 className="text-white text-xl font-serif mb-2">{gallery.listing.title}</h3>
                                <p className="text-white/50 text-sm tracking-widest mb-6">
                                    {gallery.idx + 1} / {gallery.listing.photos.length}
                                </p>

                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setInquiry(gallery.listing);
                                        setGallery(null);
                                    }}
                                    className="bg-white text-black hover:bg-[#B78454] hover:text-white rounded-none px-8 py-6 text-xs tracking-widest transition-colors duration-500"
                                >
                                    {copy[lang].properties.inquire}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                                PROPERTIES                                   */
/* -------------------------------------------------------------------------- */

function PropertiesSection({
                               id,
                               lang,
                               listings,
                               onOpen,
                               onInquire,
                           }: {
    id: string;
    lang: Lang;
    listings: Listing[];
    onOpen: (l: Listing) => void;
    onInquire: (l: Listing) => void;
}) {
    return (
        <section id={id} className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <Reveal>
                    {/* Title centered on desktop, normal on mobile */}
                    <div className="mb-12 text-left md:text-center">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{copy[lang].properties.title}</h2>

                        <div className="mt-4 flex items-center gap-3 md:justify-center">
                            <div className="h-[1px] w-14 bg-[#B78454]/90" />
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">
                                {lang === "en" ? "Curated selection" : "Selección curada"}
                            </div>
                        </div>
                    </div>
                </Reveal>

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
                        />
                    ))}
                </div>
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
                     }: {
    l: Listing;
    fallback: string;
    lang: Lang;
    index: number;
    onOpen: () => void;
    onInquire: () => void;
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
                                <div className="mt-2 font-serif text-2xl text-[#1a1a1a]">{l.title}</div>
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
