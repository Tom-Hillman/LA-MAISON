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
        location: "Mérida, Yucatán",
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

export const formatUSD = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
