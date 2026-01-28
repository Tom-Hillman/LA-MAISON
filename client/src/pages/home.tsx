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
    Sparkles,
    ShieldCheck,
    Handshake,
    KeyRound,
    Truck,
    Wrench,
    Camera,
    BadgeCheck,
} from "lucide-react";
import Lenis from "lenis";
import { useLocation } from "wouter";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Assets
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

type Lang = "en" | "es";

// ---------------- Copy ----------------
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
                "Tap to explore where we operate, how we take care of your home, and what LA MAISON actually does for buyers and owners.",
            cards: {
                locations: { title: "Locations", subtitle: "Where we operate" },
                homecare: { title: "Home Care", subtitle: "End-to-end ownership support" },
                about: { title: "About Us", subtitle: "Who we are & what we do" },
            },
        },

        overlays: {
            locations: {
                kicker: "OPERATIONS",
                title: "Where We Operate",
                body:
                    "We focus on high-demand corridors where ownership, rentals, and long-term value are strongest — with local partners and on-the-ground execution.",
                listTitle: "Core areas",
                list: ["Playa del Carmen", "Tulum", "Cancún", "Mérida"],
                noteTitle: "Countryside & bespoke requests",
                note:
                    "We also support countryside properties via vetted local teams — typically by request after a quick feasibility check.",
            },
            homecare: {
                kicker: "OWNERSHIP SUPPORT",
                title: "Home Care — A to Z",
                body:
                    "From day one after purchase to day-to-day operation: we coordinate the details that make ownership feel simple, premium, and protected.",
                sections: [
                    {
                        icon: <Sparkles className="w-4 h-4" />,
                        title: "Design & Setup",
                        text: "Layout direction, finishes, furnishing packages, styling, and setup—aligned with your home’s identity and target use (personal vs rental).",
                    },
                    {
                        icon: <Truck className="w-4 h-4" />,
                        title: "Sourcing, Import & Logistics",
                        text: "Sourcing, deliveries, vendor scheduling, and when needed: import coordination and complex delivery planning.",
                    },
                    {
                        icon: <Wrench className="w-4 h-4" />,
                        title: "Maintenance & Repairs",
                        text: "Preventative checks, reactive repairs, upgrades, inspections—through reliable, accountable local partners.",
                    },
                    {
                        icon: <Camera className="w-4 h-4" />,
                        title: "Rent Setup (Optional)",
                        text: "Photography coordination, turnover routines, supplies, and basic operational structure—so the home performs when you’re away.",
                    },
                ],
                processTitle: "How it works",
                process: [
                    { title: "Assess", text: "We review the home, goals, and constraints—then propose a realistic plan." },
                    { title: "Plan", text: "We set a timeline + budget ranges and select vendors/teams." },
                    { title: "Execute", text: "We coordinate work, deliveries, and quality checks." },
                    { title: "Maintain", text: "Ongoing care and reporting so ownership stays frictionless." },
                ],
            },
            about: {
                kicker: "LA MAISON",
                title: "A boutique platform for Mexico",
                body:
                    "LA MAISON curates strong properties and supports buyers and owners with practical local execution. We obsess over quality, timelines, and details so you don’t have to.",
                pillarsTitle: "What you get",
                pillars: [
                    { icon: <ShieldCheck className="w-4 h-4" />, title: "Risk-reduced decisions", text: "Clear guidance, fewer surprises, and real constraints upfront." },
                    { icon: <Handshake className="w-4 h-4" />, title: "Trusted local execution", text: "Vetted partners + coordination that saves time and stress." },
                    { icon: <KeyRound className="w-4 h-4" />, title: "Ownership made simple", text: "From setup to care to rental readiness—your home stays handled." },
                ],
                stepsTitle: "Our approach",
                steps: [
                    { title: "Curate", text: "We shortlist properties worth attention—quality, location, value case." },
                    { title: "Coordinate", text: "Viewings + local steps with smooth communication." },
                    { title: "Support", text: "After purchase: setup, care, and optional rental readiness." },
                ],
                ctaTitle: "Want a private shortlist?",
                ctaText: "Send your target location + budget range and we’ll respond with a curated starting point.",
            },
        },

        filters: {
            title: "Filter listings",
            search: "Search",
            location: "Location",
            type: "Type",
            price: "Price",
            clear: "Clear",
            apply: "Done",
            results: "results",
            any: "Any",
            presets: "Price presets",
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
                "Toca para ver dónde operamos, cómo cuidamos tu casa y qué hace LA MAISON para compradores y propietarios.",
            cards: {
                locations: { title: "Ubicaciones", subtitle: "Dónde operamos" },
                homecare: { title: "Cuidado del Hogar", subtitle: "Soporte integral de propiedad" },
                about: { title: "Sobre Nosotros", subtitle: "Quiénes somos y qué hacemos" },
            },
        },

        overlays: {
            locations: {
                kicker: "OPERACIÓN",
                title: "Dónde Operamos",
                body:
                    "Nos enfocamos en corredores de alta demanda donde la propiedad, renta y valor a largo plazo son más fuertes—con aliados locales y ejecución real.",
                listTitle: "Zonas principales",
                list: ["Playa del Carmen", "Tulum", "Cancún", "Mérida"],
                noteTitle: "Zona rural y solicitudes especiales",
                note:
                    "También apoyamos propiedades en zonas rurales con equipos verificados—normalmente bajo solicitud tras una revisión rápida.",
            },
            homecare: {
                kicker: "SOPORTE",
                title: "Cuidado del Hogar — A a Z",
                body:
                    "Desde el primer día tras la compra hasta la operación diaria: coordinamos los detalles para que ser propietario sea simple, premium y protegido.",
                sections: [
                    {
                        icon: <Sparkles className="w-4 h-4" />,
                        title: "Diseño y Preparación",
                        text: "Distribución, acabados, mobiliario, styling y preparación—según el objetivo (personal vs renta).",
                    },
                    {
                        icon: <Truck className="w-4 h-4" />,
                        title: "Compras, Importación y Logística",
                        text: "Compras, entregas, coordinación de proveedores y, cuando se requiere: importación y logística compleja.",
                    },
                    {
                        icon: <Wrench className="w-4 h-4" />,
                        title: "Mantenimiento y Reparaciones",
                        text: "Revisiones preventivas, reparaciones, mejoras e inspecciones—con aliados confiables y responsables.",
                    },
                    {
                        icon: <Camera className="w-4 h-4" />,
                        title: "Preparación para Renta (Opcional)",
                        text: "Fotos, rutinas de limpieza, suministros y estructura operativa básica—para rendimiento cuando no estás.",
                    },
                ],
                processTitle: "Cómo funciona",
                process: [
                    { title: "Evaluar", text: "Revisamos la casa, objetivos y restricciones—y proponemos un plan realista." },
                    { title: "Planear", text: "Definimos tiempos y rangos de presupuesto y seleccionamos equipos." },
                    { title: "Ejecutar", text: "Coordinamos obra, entregas y control de calidad." },
                    { title: "Mantener", text: "Cuidado continuo y reportes para minimizar fricción." },
                ],
            },
            about: {
                kicker: "LA MAISON",
                title: "Una plataforma boutique en México",
                body:
                    "LA MAISON cura propiedades sólidas y apoya a compradores y propietarios con ejecución práctica local. Nos obsesionan la calidad, tiempos y detalles.",
                pillarsTitle: "Lo que recibes",
                pillars: [
                    { icon: <ShieldCheck className="w-4 h-4" />, title: "Decisiones con menos riesgo", text: "Guía clara, menos sorpresas y restricciones reales desde el inicio." },
                    { icon: <Handshake className="w-4 h-4" />, title: "Ejecución local confiable", text: "Aliados verificados + coordinación que ahorra tiempo y estrés." },
                    { icon: <KeyRound className="w-4 h-4" />, title: "Propiedad simple", text: "Preparación, cuidado y opción de renta—todo coordinado." },
                ],
                stepsTitle: "Nuestro enfoque",
                steps: [
                    { title: "Curar", text: "Seleccionamos propiedades con calidad, ubicación y lógica de valor." },
                    { title: "Coordinar", text: "Visitas y pasos locales con comunicación fluida." },
                    { title: "Apoyar", text: "Tras la compra: preparación, cuidado y opción de renta." },
                ],
                ctaTitle: "¿Quieres una lista privada?",
                ctaText: "Envíanos tu zona objetivo + rango de presupuesto y respondemos con un primer shortlist.",
            },
        },

        filters: {
            title: "Filtrar propiedades",
            search: "Buscar",
            location: "Ubicación",
            type: "Tipo",
            price: "Precio",
            clear: "Limpiar",
            apply: "Listo",
            results: "resultados",
            any: "Cualquiera",
            presets: "Presets de precio",
        },
    },
} as const;

// ---------------- Body scroll lock ----------------
function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        const scrollY = window.scrollY;
        const body = document.body;
        const html = document.documentElement;

        const prevBodyOverflow = body.style.overflow;
        const prevBodyPosition = body.style.position;
        const prevBodyTop = body.style.top;
        const prevBodyWidth = body.style.width;

        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";

        // prevent iOS overscroll chaining
        html.style.overscrollBehavior = "none";

        return () => {
            body.style.overflow = prevBodyOverflow;
            body.style.position = prevBodyPosition;
            body.style.top = prevBodyTop;
            body.style.width = prevBodyWidth;
            html.style.overscrollBehavior = "";

            const y = Number(String(body.style.top || "0").replace("-", "").replace("px", "")) || scrollY;
            window.scrollTo(0, y);
        };
    }, [locked]);
}

// ---------------- Pointer ----------------
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
        }, 1100);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1a1a1a] text-[#F5F1EA]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="font-serif tracking-[0.2em] text-3xl md:text-5xl">LA MAISON</div>
                        <div className="h-[1px] w-28 bg-[#B78454]/50 overflow-hidden relative">
                            <motion.div
                                className="absolute inset-0 bg-[#B78454]"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
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

// ---------------- Reveal ----------------
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

// ---------------- SplitTitle ----------------
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

// ---------------- ClipRevealImage ----------------
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

// ---------------- Noise ----------------
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

// ---------------- Particles ----------------
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

// ---------------- Scroll progress ----------------
function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });
    return (
        <motion.div className="fixed left-0 top-0 z-[9998] h-[3px] w-full bg-black/5">
            <motion.div className="h-full bg-primary" style={{ scaleX: sx, transformOrigin: "0% 50%" }} />
        </motion.div>
    );
}

// ---------------- WhatsApp ----------------
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

// ---------------- API ----------------
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
    const url = `${window.location.origin}/properties/${listing.id}`;
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

// ---------------- Premium overlay ----------------
function PremiumOverlay({
                            open,
                            kicker,
                            title,
                            heroImg,
                            children,
                            onClose,
                        }: {
    open: boolean;
    kicker: string;
    title: string;
    heroImg: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    // lock the BODY so the page behind doesn't scroll (fixes PC+mobile)
    useBodyScrollLock(open);

    // ESC close
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
                    className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="absolute inset-0 overflow-hidden"
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 16, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* scroll container */}
                        <div className="h-full overflow-y-auto overscroll-contain">
                            <div className="min-h-screen px-4 md:px-8 py-8 md:py-12">
                                <div className="max-w-5xl mx-auto bg-[#F5F1EA] border border-black/10 shadow-2xl overflow-hidden">
                                    {/* Hero header */}
                                    <div className="relative h-56 md:h-72">
                                        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute left-0 right-0 bottom-0 p-6 md:p-10 text-white">
                                            <div className="text-[10px] tracking-[0.28em] uppercase opacity-90">{kicker}</div>
                                            <div className="mt-2 font-serif text-3xl md:text-5xl">{title}</div>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border border-white/20 p-2"
                                            aria-label="Close"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-10">{children}</div>

                                    {/* Footer CTA strip */}
                                    <div className="border-t border-black/10 bg-white px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div>
                                            <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Contact</div>
                                            <div className="mt-2 text-sm text-black/70">
                                                <span className="font-medium text-black">+34 667 640 713</span> •{" "}
                                                <span className="font-medium text-black">lamaisonmexico@gmail.com</span>
                                            </div>
                                            <div className="mt-1 text-xs text-black/50">Address: by appointment</div>
                                        </div>
                                        <Button
                                            className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white px-6"
                                            onClick={onClose}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>

                                {/* bottom spacer */}
                                <div className="h-10" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ---------------- Filters UI ----------------
const MAIN_LOCATIONS = ["Playa del Carmen", "Tulum", "Cancún", "Mérida", "Ciudad de México"] as const;
const TYPES: Listing["type"][] = ["Hacienda", "Villa", "Casa", "Condo"];

const PRICE_PRESETS = [
    { label: "Under $300k", min: 0, max: 300000 },
    { label: "$300k – $450k", min: 300000, max: 450000 },
    { label: "$450k – $650k", min: 450000, max: 650000 },
    { label: "$650k – $900k", min: 650000, max: 900000 },
    { label: "$900k+", min: 900000, max: Infinity },
];

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "px-3 py-2 border text-[10px] tracking-[0.26em] uppercase transition-colors",
                active ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-black/10 text-black/70 hover:border-black/30"
            )}
        >
            {children}
        </button>
    );
}

function FilterDrawer({
                          open,
                          onClose,
                          lang,
                          search,
                          setSearch,
                          selectedLocations,
                          toggleLocation,
                          selectedTypes,
                          toggleType,
                          pricePreset,
                          setPricePreset,
                          onClear,
                          resultCount,
                      }: {
    open: boolean;
    onClose: () => void;
    lang: Lang;
    search: string;
    setSearch: (v: string) => void;
    selectedLocations: Set<string>;
    toggleLocation: (loc: string) => void;
    selectedTypes: Set<string>;
    toggleType: (t: string) => void;
    pricePreset: string | null;
    setPricePreset: (v: string | null) => void;
    onClear: () => void;
    resultCount: number;
}) {
    useBodyScrollLock(open);

    const t = copy[lang].filters;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[85] bg-black/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="absolute right-0 top-0 h-full w-full md:w-[520px] bg-[#F5F1EA] border-l border-black/10 overflow-hidden"
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 30, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full overflow-y-auto overscroll-contain">
                            <div className="p-6 md:p-8 border-b border-black/10 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">{t.title}</div>
                                    <div className="mt-2 font-serif text-2xl">{resultCount} {t.results}</div>
                                </div>
                                <button onClick={onClose} className="p-2 border border-black/10 bg-white hover:border-black/30">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-8">
                                {/* Search */}
                                <div>
                                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60 mb-3">{t.search}</div>
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="rounded-none border-black/10 bg-white"
                                        placeholder={lang === "en" ? "Try “tulum”, “hacienda”, “2 beds”…" : "Ej: “tulum”, “hacienda”, “2 rec”…"}
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60 mb-3">{t.location}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {MAIN_LOCATIONS.map((loc) => (
                                            <Pill key={loc} active={selectedLocations.has(loc)} onClick={() => toggleLocation(loc)}>
                                                {selectedLocations.has(loc) ? (
                                                    <span className="inline-flex items-center gap-2">
                            <Check className="w-3 h-3" /> {loc}
                          </span>
                                                ) : (
                                                    loc
                                                )}
                                            </Pill>
                                        ))}
                                    </div>
                                </div>

                                {/* Type */}
                                <div>
                                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60 mb-3">{t.type}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {TYPES.map((tp) => (
                                            <Pill key={tp} active={selectedTypes.has(tp)} onClick={() => toggleType(tp)}>
                                                {selectedTypes.has(tp) ? (
                                                    <span className="inline-flex items-center gap-2">
                            <Check className="w-3 h-3" /> {tp}
                          </span>
                                                ) : (
                                                    tp
                                                )}
                                            </Pill>
                                        ))}
                                    </div>
                                </div>

                                {/* Price presets */}
                                <div>
                                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60 mb-3">{t.presets}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {PRICE_PRESETS.map((p) => (
                                            <button
                                                key={p.label}
                                                type="button"
                                                onClick={() => setPricePreset(pricePreset === p.label ? null : p.label)}
                                                className={cn(
                                                    "border px-4 py-3 text-left transition-colors",
                                                    pricePreset === p.label
                                                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                                                        : "bg-white border-black/10 hover:border-black/30 text-black/70"
                                                )}
                                            >
                                                <div className="text-[10px] tracking-[0.26em] uppercase">{p.label}</div>
                                                <div className={cn("mt-1 text-sm", pricePreset === p.label ? "text-white/80" : "text-black/60")}>
                                                    {p.max === Infinity ? "Premium tier" : `${formatUSD(p.min)} to ${formatUSD(p.max)}`}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Button variant="ghost" className="rounded-none" onClick={onClear}>
                                        {t.clear}
                                    </Button>
                                    <Button className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white" onClick={onClose}>
                                        {t.apply}
                                    </Button>
                                </div>
                            </div>

                            <div className="h-10" />
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

    // Overlays
    const [overlay, setOverlay] = useState<OverlayKey | null>(null);

    // Filters
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [locSet, setLocSet] = useState<Set<string>>(new Set());
    const [typeSet, setTypeSet] = useState<Set<string>>(new Set());
    const [pricePreset, setPricePreset] = useState<string | null>(null);

    // Contact form state
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactMsg, setContactMsg] = useState("");

    // Inquiry modal state
    const [inqName, setInqName] = useState("");
    const [inqEmail, setInqEmail] = useState("");
    const [inqMsg, setInqMsg] = useState("");

    // Lock body when any modal/overlay is open (fixes “page behind scrolls” and phone “stuck”)
    const anyModalOpen = Boolean(overlay) || Boolean(inquiry) || filtersOpen;
    useBodyScrollLock(anyModalOpen);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lenis Smooth Scroll ONLY when not in modal/overlay, to avoid scroll bugs
    useEffect(() => {
        if (!preloaderDone) return;
        if (anyModalOpen) return;

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        } as any);

        let raf = 0;
        const loop = (time: number) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, [preloaderDone, anyModalOpen]);

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

    const overlays = copy[lang].overlays;
    const lifestyle = copy[lang].lifestyle;
    const why = copy[lang].why;

    const toggleLocation = (loc: string) => {
        setLocSet((prev) => {
            const next = new Set(prev);
            if (next.has(loc)) next.delete(loc);
            else next.add(loc);
            return next;
        });
    };

    const toggleType = (tp: string) => {
        setTypeSet((prev) => {
            const next = new Set(prev);
            if (next.has(tp)) next.delete(tp);
            else next.add(tp);
            return next;
        });
    };

    const clearFilters = () => {
        setSearch("");
        setLocSet(new Set());
        setTypeSet(new Set());
        setPricePreset(null);
    };

    const filteredListings = useMemo(() => {
        let list = [...LISTINGS];

        // search (title + location + type + id)
        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter((l) => {
                const hay = `${l.title} ${l.location} ${l.type} ${l.id}`.toLowerCase();
                return hay.includes(q);
            });
        }

        // location set
        if (locSet.size > 0) {
            list = list.filter((l) => locSet.has(l.location));
        }

        // type set
        if (typeSet.size > 0) {
            list = list.filter((l) => typeSet.has(l.type));
        }

        // price preset
        if (pricePreset) {
            const p = PRICE_PRESETS.find((x) => x.label === pricePreset);
            if (p) {
                list = list.filter((l) => l.priceUSD >= p.min && l.priceUSD <= p.max);
            }
        }

        // keep stable ordering by id
        list.sort((a, b) => a.id.localeCompare(b.id));

        return list;
    }, [search, locSet, typeSet, pricePreset]);

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
                    style={scrolled ? { WebkitBackdropFilter: "blur(18px)", backdropFilter: "blur(18px)" } : undefined}
                >
                    <button
                        onClick={() => go("home")}
                        className="font-serif text-xl tracking-widest text-white mix-blend-difference"
                    >
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

                    {/* Scroll goes to PROPERTIES (your request) */}
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

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { icon: <BadgeCheck className="w-4 h-4" />, label: lang === "en" ? "Curated selection" : "Selección curada" },
                                        { icon: <ShieldCheck className="w-4 h-4" />, label: lang === "en" ? "Risk-aware guidance" : "Guía con menor riesgo" },
                                        { icon: <Handshake className="w-4 h-4" />, label: lang === "en" ? "Trusted local partners" : "Aliados confiables" },
                                        { icon: <KeyRound className="w-4 h-4" />, label: lang === "en" ? "Smooth ownership setup" : "Preparación simple" },
                                    ].map((x) => (
                                        <div key={x.label} className="border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                                            <span className="text-[#B78454]">{x.icon}</span>
                                            <span className="text-xs tracking-[0.18em] uppercase text-white/80">{x.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* PROPERTIES */}
                <PropertiesSection
                    id="properties"
                    lang={lang}
                    listings={filteredListings}
                    resultCount={filteredListings.length}
                    onOpen={(l) => {
                        // Close anything that might keep scroll locked before navigating
                        setOverlay(null);
                        setInquiry(null);
                        setFiltersOpen(false);

                        // Navigate next frame (ensures lock cleanup runs)
                        requestAnimationFrame(() => setLocation(`/properties/${l.id}`));
                    }}
                    onInquire={(l) => {
                        setInquiry(l);
                        setInqMsg("");
                    }}
                    onShare={(l) => shareListing(l)}
                    onOpenFilters={() => setFiltersOpen(true)}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
                                <motion.img
                                    src={BEACH_IMG}
                                    alt="Locations"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Reveal>

                            {/* HOME CARE (changed image to interior) */}
                            <Reveal className="relative group overflow-hidden aspect-video md:aspect-[16/9] cursor-pointer" delay={0.15}>
                                <button type="button" onClick={() => setOverlay("homecare")} className="absolute inset-0 z-20" aria-label="Open home care" />
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <h3 className="text-white text-3xl font-serif">{lifestyle.cards.homecare.title}</h3>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                        {lifestyle.cards.homecare.subtitle}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
                                <motion.img
                                    src={INTERIOR_IMG}
                                    alt="Home Care"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
                                <motion.img
                                    src={CENOTE_IMG}
                                    alt="About Us"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
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

                        <Reveal delay={0.2}>
                            <Card className="border-none shadow-2xl shadow-black/5 bg-white overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/3 bg-[#1a1a1a] p-10 text-white flex flex-col justify-between">
                                        <div className="space-y-4 text-sm opacity-80 font-light">
                                            <p className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-[#B78454]" />
                                                Address: by appointment
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
                        <p className="text-xs tracking-widest">© 2026 LA MAISON MEXICO</p>
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
                        <InquiryModal
                            inquiry={inquiry}
                            lang={lang}
                            sending={sending}
                            inqName={inqName}
                            setInqName={setInqName}
                            inqEmail={inqEmail}
                            setInqEmail={setInqEmail}
                            inqMsg={inqMsg}
                            setInqMsg={setInqMsg}
                            onClose={() => setInquiry(null)}
                            onSend={async () => {
                                setSending(true);
                                try {
                                    await sendInquiry({
                                        name: inqName.trim(),
                                        email: inqEmail.trim(),
                                        message: (inqMsg || "").trim(),
                                        listingId: inquiry.id,
                                    });
                                    setInquiry(null);
                                    setInqMsg("");
                                    alert(lang === "en" ? "Sent! We'll get back to you soon." : "¡Enviado! Te contactaremos pronto.");
                                } finally {
                                    setSending(false);
                                }
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Filter drawer */}
                <FilterDrawer
                    open={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                    lang={lang}
                    search={search}
                    setSearch={setSearch}
                    selectedLocations={locSet}
                    toggleLocation={toggleLocation}
                    selectedTypes={typeSet}
                    toggleType={toggleType}
                    pricePreset={pricePreset}
                    setPricePreset={setPricePreset}
                    onClear={clearFilters}
                    resultCount={filteredListings.length}
                />

                {/* Overlays */}
                <PremiumOverlay
                    open={overlay === "locations"}
                    kicker={overlays.locations.kicker}
                    title={overlays.locations.title}
                    heroImg={BEACH_IMG}
                    onClose={() => setOverlay(null)}
                >
                    <p className="text-[#5E5E5E] leading-relaxed">{overlays.locations.body}</p>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-black/10 bg-white p-6">
                            <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">{overlays.locations.listTitle}</div>
                            <div className="mt-4 space-y-2">
                                {overlays.locations.list.map((x) => (
                                    <div key={x} className="border border-black/10 bg-[#F5F1EA] px-4 py-3 flex items-center justify-between">
                                        <span className="text-sm">{x}</span>
                                        <MapPin className="w-4 h-4 text-black/40" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-black/10 bg-white p-6">
                            <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">{overlays.locations.noteTitle}</div>
                            <p className="mt-4 text-[#5E5E5E] leading-relaxed">{overlays.locations.note}</p>
                            <div className="mt-6 border-t border-black/10 pt-5 text-sm text-black/70">
                                <div className="flex items-start gap-3">
                                    <BadgeCheck className="w-5 h-5 text-[#B78454]" />
                                    <p>
                                        We typically start with a quick feasibility check: access, infrastructure, local reliability, and
                                        serviceability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PremiumOverlay>

                <PremiumOverlay
                    open={overlay === "homecare"}
                    kicker={overlays.homecare.kicker}
                    title={overlays.homecare.title}
                    heroImg={INTERIOR_IMG}
                    onClose={() => setOverlay(null)}
                >
                    <p className="text-[#5E5E5E] leading-relaxed">{overlays.homecare.body}</p>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {overlays.homecare.sections.map((s) => (
                            <div key={s.title} className="border border-black/10 bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#B78454]">{s.icon}</span>
                                    <div className="text-xs tracking-[0.22em] uppercase text-black/70">{s.title}</div>
                                </div>
                                <p className="mt-4 text-[#5E5E5E] leading-relaxed">{s.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 border border-black/10 bg-white p-6">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">{overlays.homecare.processTitle}</div>
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
                            {overlays.homecare.process.map((p) => (
                                <div key={p.title} className="border border-black/10 bg-[#F5F1EA] p-5">
                                    <div className="text-xs tracking-[0.22em] uppercase text-[#B78454]">{p.title}</div>
                                    <p className="mt-3 text-sm text-black/70 leading-relaxed">{p.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 border border-black/10 bg-white p-6">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Quality & accountability</div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { icon: <ShieldCheck className="w-4 h-4" />, title: "Vetted teams", text: "Reliable local partners with clear expectations." },
                                { icon: <Wrench className="w-4 h-4" />, title: "Checks & follow-ups", text: "We coordinate quality checks and close loops." },
                                { icon: <BadgeCheck className="w-4 h-4" />, title: "Ownership clarity", text: "Simple communication and realistic timelines." },
                            ].map((x) => (
                                <div key={x.title} className="border border-black/10 bg-[#F5F1EA] p-5">
                                    <div className="flex items-center gap-2 text-[#B78454]">{x.icon}</div>
                                    <div className="mt-2 text-xs tracking-[0.22em] uppercase text-black/70">{x.title}</div>
                                    <p className="mt-3 text-sm text-black/70 leading-relaxed">{x.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </PremiumOverlay>

                <PremiumOverlay
                    open={overlay === "about"}
                    kicker={overlays.about.kicker}
                    title={overlays.about.title}
                    heroImg={CENOTE_IMG}
                    onClose={() => setOverlay(null)}
                >
                    <p className="text-[#5E5E5E] leading-relaxed">{overlays.about.body}</p>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {overlays.about.pillars.map((p) => (
                            <div key={p.title} className="border border-black/10 bg-white p-6">
                                <div className="text-[#B78454]">{p.icon}</div>
                                <div className="mt-3 text-xs tracking-[0.22em] uppercase text-black/70">{p.title}</div>
                                <p className="mt-3 text-[#5E5E5E] leading-relaxed">{p.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 border border-black/10 bg-white p-6">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">{overlays.about.stepsTitle}</div>
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                            {overlays.about.steps.map((s) => (
                                <div key={s.title} className="border border-black/10 bg-[#F5F1EA] p-5">
                                    <div className="text-xs tracking-[0.22em] uppercase text-[#B78454]">{s.title}</div>
                                    <p className="mt-3 text-sm text-black/70 leading-relaxed">{s.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 border border-black/10 bg-white p-6">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">{overlays.about.ctaTitle}</div>
                        <p className="mt-4 text-[#5E5E5E] leading-relaxed">{overlays.about.ctaText}</p>
                        <div className="mt-6 flex flex-col md:flex-row gap-3">
                            <a
                                href="mailto:lamaisonmexico@gmail.com"
                                className="inline-flex items-center justify-center border border-black/10 bg-[#1a1a1a] text-white px-6 py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#B78454] transition-colors"
                            >
                                Email us
                            </a>
                            <a
                                href="https://wa.me/34667640713"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center border border-black/10 bg-white text-black px-6 py-4 text-xs tracking-[0.22em] uppercase hover:border-black/30 transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </PremiumOverlay>
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
                               resultCount,
                               onOpen,
                               onInquire,
                               onShare,
                               onOpenFilters,
                           }: {
    id: string;
    lang: Lang;
    listings: Listing[];
    resultCount: number;
    onOpen: (l: Listing) => void;
    onInquire: (l: Listing) => void;
    onShare: (l: Listing) => void;
    onOpenFilters: () => void;
}) {
    return (
        <section id={id} className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <Reveal>
                    <div className="mb-10 text-left md:text-center">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{copy[lang].properties.title}</h2>
                        <div className="mt-4 flex items-center gap-3 md:justify-center">
                            <div className="h-[1px] w-14 bg-[#B78454]/90" />
                            <div className="text-[10px] tracking-[0.28em] uppercase text-[#5E5E5E]">
                                {resultCount} {lang === "en" ? "results" : "resultados"}
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Filter bar */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="text-xs tracking-[0.22em] uppercase text-black/60">
                        {lang === "en" ? "Curated selection" : "Selección curada"}
                    </div>

                    <Button
                        onClick={onOpenFilters}
                        className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white px-5"
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {lang === "en" ? "Filter" : "Filtrar"}
                    </Button>
                </div>

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
        <Reveal delay={index * 0.04}>
            <motion.div
                className="border border-black/10 bg-white overflow-hidden"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="relative h-[190px] md:h-full w-full overflow-hidden"
                    >
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

                        <div className="mt-4 text-sm text-[#5E5E5E] leading-relaxed line-clamp-2">
                            {l.description[lang]}
                        </div>

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

/* -------------------------------------------------------------------------- */
/*                                INQUIRY MODAL                               */
/* -------------------------------------------------------------------------- */

function InquiryModal({
                          inquiry,
                          lang,
                          sending,
                          inqName,
                          setInqName,
                          inqEmail,
                          setInqEmail,
                          inqMsg,
                          setInqMsg,
                          onClose,
                          onSend,
                      }: {
    inquiry: Listing;
    lang: Lang;
    sending: boolean;
    inqName: string;
    setInqName: (v: string) => void;
    inqEmail: string;
    setInqEmail: (v: string) => void;
    inqMsg: string;
    setInqMsg: (v: string) => void;
    onClose: () => void;
    onSend: () => Promise<void>;
}) {
    // lock the body so the page behind does not scroll
    useBodyScrollLock(true);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[88] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 10 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#F5F1EA] max-w-2xl w-full border border-black/10 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-6 px-6 md:px-8 py-6 border-b border-black/10 bg-white">
                    <div>
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/50">
                            {lang === "en" ? "Inquiry" : "Consulta"} • {inquiry.id}
                        </div>
                        <div className="mt-2 font-serif text-2xl md:text-3xl text-[#1a1a1a]">{inquiry.title}</div>
                        <div className="mt-2 flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-black/50">
                            <MapPin className="w-3.5 h-3.5" />
                            {inquiry.location} • {formatUSD(inquiry.priceUSD)}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 border border-black/10 bg-white hover:border-black/30 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                    <div className="relative h-44 md:h-full">
                        <img {...safeImage(inquiry.image, HERO_FALLBACK)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/50">
                            {lang === "en" ? "Tell us what you want" : "Cuéntanos lo que buscas"}
                        </div>

                        <div className="mt-5 space-y-4">
                            <Input
                                value={inqName}
                                onChange={(e) => setInqName(e.target.value)}
                                placeholder={copy[lang].contact.name}
                                className="rounded-none border-black/10 bg-white"
                            />
                            <Input
                                value={inqEmail}
                                type="email"
                                onChange={(e) => setInqEmail(e.target.value)}
                                placeholder={copy[lang].contact.email}
                                className="rounded-none border-black/10 bg-white"
                            />
                            <textarea
                                className="w-full border border-black/10 bg-white rounded-none p-3 text-sm focus:outline-none focus:border-[#B78454] min-h-[120px]"
                                value={inqMsg}
                                onChange={(e) => setInqMsg(e.target.value)}
                                placeholder={lang === "en" ? `Message about ${inquiry.title}...` : `Mensaje sobre ${inquiry.title}...`}
                            />
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button
                                disabled={sending}
                                onClick={onSend}
                                className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white px-6 py-6 text-xs tracking-[0.22em] uppercase"
                            >
                                {sending ? (lang === "en" ? "SENDING..." : "ENVIANDO...") : copy[lang].contact.send}
                            </Button>

                            <a
                                href="https://wa.me/34667640713"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center border border-black/10 bg-white text-black px-6 py-4 text-xs tracking-[0.22em] uppercase hover:border-black/30 transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>

                        <div className="mt-6 text-xs text-black/50 leading-relaxed">
                            {lang === "en"
                                ? "By sending, you agree we can contact you about this property. We’ll respond with next steps and availability."
                                : "Al enviar, aceptas que podamos contactarte sobre esta propiedad. Responderemos con próximos pasos y disponibilidad."}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
