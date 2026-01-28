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

// extra variety (still just URLs)
const EXTRA = [
    "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691723518-36a5ac3b2fcb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
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

    // --- Added listings ---
    {
        id: "LM-007",
        title: "Condo Mar Azul",
        location: "Playa del Carmen, Quintana Roo",
        priceUSD: 289000,
        beds: 2,
        baths: 2,
        areaM2: 108,
        type: "Condo",
        image: EXTRA[0],
        photos: [EXTRA[0], LISTING_IMAGES[7], LISTING_IMAGES[2], LISTING_IMAGES[1]],
        description: {
            en: "Beach-adjacent condo with practical layouts and strong demand—ideal as a lock-and-leave base.",
            es: "Condominio cerca de la playa con distribución práctica y alta demanda—ideal como base fácil de mantener.",
        },
    },
    {
        id: "LM-008",
        title: "Casa Jardín Silencioso",
        location: "San Miguel de Allende, Guanajuato",
        priceUSD: 495000,
        beds: 3,
        baths: 3,
        areaM2: 240,
        type: "Casa",
        image: EXTRA[1],
        photos: [EXTRA[1], LISTING_IMAGES[0], LISTING_IMAGES[6], LISTING_IMAGES[3]],
        description: {
            en: "Quiet garden living with timeless materials—built for long stays and easy ownership.",
            es: "Vida tranquila con jardín y materiales atemporales—pensada para estancias largas y propiedad simple.",
        },
    },
    {
        id: "LM-009",
        title: "Villa Selva Clara",
        location: "Tulum, Quintana Roo",
        priceUSD: 520000,
        beds: 3,
        baths: 3,
        areaM2: 260,
        type: "Villa",
        image: EXTRA[2],
        photos: [EXTRA[2], LISTING_IMAGES[2], LISTING_IMAGES[7], LISTING_IMAGES[4]],
        description: {
            en: "A private, lush villa concept with shaded outdoor zones—designed for comfort and rental appeal.",
            es: "Villa privada y verde con zonas exteriores sombreadas—diseñada para confort y atractivo de renta.",
        },
    },
    {
        id: "LM-010",
        title: "Hacienda Piedra Antigua",
        location: "Izamal, Yucatán",
        priceUSD: 610000,
        beds: 4,
        baths: 4,
        areaM2: 460,
        type: "Hacienda",
        image: EXTRA[3],
        photos: [EXTRA[3], LISTING_IMAGES[4], LISTING_IMAGES[5], LISTING_IMAGES[0]],
        description: {
            en: "Historic mood with modern execution—generous spaces, textured finishes, and serene indoor-outdoor flow.",
            es: "Ambiente histórico con ejecución moderna—espacios generosos, texturas y flujo interior-exterior sereno.",
        },
    },
    {
        id: "LM-011",
        title: "Condo Skyline Reforma",
        location: "Ciudad de México",
        priceUSD: 410000,
        beds: 2,
        baths: 2,
        areaM2: 118,
        type: "Condo",
        image: LISTING_IMAGES[1],
        photos: [LISTING_IMAGES[1], LISTING_IMAGES[3], LISTING_IMAGES[6], LISTING_IMAGES[2]],
        description: {
            en: "A crisp city condo with strong proportions—ideal for a modern Mexico City base and stable long-term demand.",
            es: "Condominio urbano con proporciones sólidas—ideal como base moderna y con demanda estable.",
        },
    },
    {
        id: "LM-012",
        title: "Casa Arena Blanca",
        location: "Cancún, Quintana Roo",
        priceUSD: 535000,
        beds: 4,
        baths: 4,
        areaM2: 330,
        type: "Casa",
        image: LISTING_IMAGES[7],
        photos: [LISTING_IMAGES[7], LISTING_IMAGES[0], LISTING_IMAGES[5], LISTING_IMAGES[6]],
        description: {
            en: "A bright coastal home with generous entertaining zones—built for family use or managed stays.",
            es: "Casa costera luminosa con amplias zonas sociales—ideal para familia o estancias gestionadas.",
        },
    },
];

export const formatUSD = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
