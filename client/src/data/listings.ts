export type Listing = {
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

export const LISTING_IMAGES = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
];

export const LISTINGS: Listing[] = [
    {
        id: "LM-001",
        title: "Hacienda Santa Luna",
        location: "Mérida",
        priceUSD: 625000,
        beds: 4,
        baths: 4,
        areaM2: 420,
        type: "Hacienda",
        image: LISTING_IMAGES[4],
        photos: [LISTING_IMAGES[4], LISTING_IMAGES[6], LISTING_IMAGES[7], LISTING_IMAGES[0]],
        description: {
            en: "Courtyard-centered hacienda with double-height living, hand-finished plaster, and warm quiet light throughout.",
            es: "Hacienda con patio central, sala de doble altura, estuco artesanal y una luz cálida y tranquila.",
        },
    },
    {
        id: "LM-003",
        title: "Villa Agave Verde",
        location: "Tulum",
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
        location: "Mérida",
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
        location: "Playa del Carmen",
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

    // More listings
    {
        id: "LM-007",
        title: "Condo Marina Light",
        location: "Cancún",
        priceUSD: 289000,
        beds: 2,
        baths: 2,
        areaM2: 110,
        type: "Condo",
        image: LISTING_IMAGES[1],
        photos: [LISTING_IMAGES[1], LISTING_IMAGES[3], LISTING_IMAGES[2], LISTING_IMAGES[7]],
        description: {
            en: "Bright marina-side condo with practical layout, strong rental appeal, and effortless lock-and-leave ownership.",
            es: "Condominio luminoso cerca de la marina, distribución práctica y gran potencial de renta.",
        },
    },
    {
        id: "LM-008",
        title: "Villa Cenote Breeze",
        location: "Tulum",
        priceUSD: 495000,
        beds: 3,
        baths: 3,
        areaM2: 245,
        type: "Villa",
        image: LISTING_IMAGES[7],
        photos: [LISTING_IMAGES[7], LISTING_IMAGES[2], LISTING_IMAGES[0], LISTING_IMAGES[6]],
        description: {
            en: "Indoor-outdoor villa with shaded terraces and a calm, private atmosphere designed for long weekends or full seasons.",
            es: "Villa interior-exterior con terrazas sombreadas y ambiente privado para estancias largas o fines de semana.",
        },
    },
    {
        id: "LM-009",
        title: "Casa Palm Courtyard",
        location: "Playa del Carmen",
        priceUSD: 349000,
        beds: 3,
        baths: 2,
        areaM2: 210,
        type: "Casa",
        image: LISTING_IMAGES[0],
        photos: [LISTING_IMAGES[0], LISTING_IMAGES[5], LISTING_IMAGES[6], LISTING_IMAGES[2]],
        description: {
            en: "A calm courtyard home with soft materials and an easy everyday rhythm—ideal for buyers who want simplicity with style.",
            es: "Casa con patio tranquilo, materiales suaves y ritmo fácil—ideal para quienes buscan simplicidad con estilo.",
        },
    },
    {
        id: "LM-010",
        title: "Hacienda Quiet Arcades",
        location: "Mérida",
        priceUSD: 890000,
        beds: 6,
        baths: 6,
        areaM2: 640,
        type: "Hacienda",
        image: LISTING_IMAGES[6],
        photos: [LISTING_IMAGES[6], LISTING_IMAGES[4], LISTING_IMAGES[7], LISTING_IMAGES[1]],
        description: {
            en: "Elegant arcades, generous courtyards, and classic proportions—built for families, entertaining, and long-term value.",
            es: "Arquerías elegantes, patios generosos y proporciones clásicas—para familia, eventos y valor a largo plazo.",
        },
    },
    {
        id: "LM-011",
        title: "Condo Roma Atelier",
        location: "Ciudad de México",
        priceUSD: 315000,
        beds: 1,
        baths: 1,
        areaM2: 78,
        type: "Condo",
        image: LISTING_IMAGES[2],
        photos: [LISTING_IMAGES[2], LISTING_IMAGES[3], LISTING_IMAGES[1], LISTING_IMAGES[5]],
        description: {
            en: "Design-forward city base with walkability and a clean plan—ideal as a stable anchor with strong long-term demand.",
            es: "Base urbana con diseño, gran caminabilidad y plano limpio—ideal como activo estable con buena demanda.",
        },
    },
    {
        id: "LM-012",
        title: "Villa Sunset Canopy",
        location: "Cancún",
        priceUSD: 565000,
        beds: 4,
        baths: 3,
        areaM2: 320,
        type: "Villa",
        image: LISTING_IMAGES[3],
        photos: [LISTING_IMAGES[3], LISTING_IMAGES[0], LISTING_IMAGES[7], LISTING_IMAGES[6]],
        description: {
            en: "A spacious villa with shaded garden zones and easy hosting flow—great for owner use with optional rental strategy.",
            es: "Villa amplia con zonas de sombra y excelente flujo para recibir—ideal para uso personal con opción de renta.",
        },
    },
];

export const formatUSD = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
