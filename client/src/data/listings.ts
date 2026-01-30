import COLOURFUL_HOUSE_1 from "@assets/listing_images/colourful-mexican-house (1).jpg";
import COLOURFUL_HOUSE_2 from "@assets/listing_images/colourful-mexican-house.jpg";
import COLOURFUL_TRAD_1 from "@assets/listing_images/colourful-traditional-mexican-house (1).jpg";
import COLOURFUL_TRAD_2 from "@assets/listing_images/colourful-traditional-mexican-house (2).jpg";
import COLOURFUL_TRAD_3 from "@assets/listing_images/colourful-traditional-mexican-house.jpg";
import FOLKLORE_INTERIOR from "@assets/listing_images/interior-decoration-inspired-by-mexican-folklore.jpg";
import LUXURY_HOLIDAY_HOME from "@assets/listing_images/luxury-holiday-home.jpg";
import MODERN_LIVING from "@assets/listing_images/modern-living-room.jpg";
import MODERN_ENTRYWAY from "@assets/listing_images/modern-styled-small-entryway.jpg";
import COURTYARD_POOL from "@assets/listing_images/moroccan-courtyard-oasis-with-reflecting-pool.jpg";
import TRAD_ARCH_1 from "@assets/listing_images/traditional-house-architecture (1).jpg";
import TRAD_ARCH_2 from "@assets/listing_images/traditional-house-architecture.jpg";
import TRAD_INTERIOR from "@assets/listing_images/traditional-house-interior-design.jpg";
import POOL_TROPICAL_PLANTS from "@assets/listing_images/vecteezy_a-pool-surrounded-by-lush-tropical-plants_71667211.jpeg";
import POOL_PALM_TREES from "@assets/listing_images/vecteezy_a-pool-surrounded-by-palm-trees_69929475.jpeg";
import BEDROOM_WOODEN_WINDOWS from "@assets/listing_images/vecteezy_a-spacious-and-cozy-bedroom-with-large-windows-wooden_69638273.jpg";
import BEDROOM_NATURAL_DECOR from "@assets/listing_images/vecteezy_cozy-bedroom-with-natural-decor-featuring-a-large-bed-and_73309554.jpeg";
import BEDROOM_ADOBE from "@assets/listing_images/vecteezy_desert-adobe-bedroom-terracotta-floor-linen-bedding_70994389.jpeg";
import BEDROOM_SANDSTONE from "@assets/listing_images/vecteezy_desert-retreat-bedroom-sandstone-walls-linen-bed-pottery_70994314.jpeg";
import POOL_INFINITY_SUNSET from "@assets/listing_images/vecteezy_luxurious-infinity-pool-overlooking-calm-waters-at-sunset-by_55752779.jpeg";
import OPEN_PLAN_LIVING from "@assets/listing_images/vecteezy_photorealistic-interior-shot-of-an-open-plan-living-and_72508310.jpg";
import RUSTIC_DINING from "@assets/listing_images/vecteezy_rustic-dining-room-sunlight-wooden-table-pottery-and-warm_71722091.jpeg";
import RUSTIC_KITCHEN from "@assets/listing_images/vecteezy_rustic-kitchen-interior-warm-light-ancient-pottery-wooden_71722097.jpeg";
import RUSTIC_ARCHES from "@assets/listing_images/vecteezy_rustic-style-space-with-stone-arches-leather-couches-and_73473064.jpeg";
import URBAN_RESIDENCE from "@assets/listing_images/vecteezy_sophisticated-urban-residence-designed-for-comfortable_53286508.jpg";
import RUSTIC_BRICK_ARCHES from "@assets/listing_images/vecteezy_warm-rustic-interior-with-brick-arches-brown-leather_73473088.jpeg";

const LISTING_IMAGE_01 = COLOURFUL_HOUSE_1;
const LISTING_IMAGE_02 = COLOURFUL_HOUSE_2;
const LISTING_IMAGE_03 = COLOURFUL_TRAD_1;
const LISTING_IMAGE_04 = COLOURFUL_TRAD_2;
const LISTING_IMAGE_05 = COLOURFUL_TRAD_3;
const LISTING_IMAGE_06 = LUXURY_HOLIDAY_HOME;
const LISTING_IMAGE_07 = TRAD_ARCH_1;
const LISTING_IMAGE_08 = TRAD_ARCH_2;

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

    // Maps data (neighbourhood-level, sensible + clickable)
    maps?: {
        query?: string; // used for Google Maps links + embed (e.g. "Centro, 97000 Mérida, Yucatán, Mexico")
        displayAddress?: string; // what user sees (e.g. "Centro, Mérida, Yucatán")
        postcode?: string; // what user sees (e.g. "97000")
        lat?: number;
        lng?: number;
    };
};

// ------------------ IMAGE HELPERS ------------------
// Local placeholders (swap files in attached_assets/listing_images with real photos later).
// Curated, cohesive “Mexico vibes” sets (same tone per property)
const HACIENDA_SET = [
    // Mérida colonial street / exterior vibe
    LISTING_IMAGE_01,
    // Oaxaca courtyard arches / colonial
    LISTING_IMAGE_02,
    // Warm living room (natural textures)
    LISTING_IMAGE_03,
    // Mexican tiled interior (strong local feel)
    LISTING_IMAGE_04,
    // Bedroom shot in Mexico
    LISTING_IMAGE_05,
    // Courtyard/pool resort feel (works as “garden/pool”)
    LISTING_IMAGE_06,
];

const TULUM_VILLA_SET = [
    // Tulum pool house (clear “Mexico / Tulum” mood)
    LISTING_IMAGE_07,
    // Villa pool (tropical modern)
    LISTING_IMAGE_08,
    // Indoor living (boho-luxe)
    LISTING_IMAGE_03,
    // Bedroom (tropical/linen)
    LISTING_IMAGE_01,
    // Kitchen (clean modern)
    LISTING_IMAGE_02,
    // Extra pool/resort vibe
    LISTING_IMAGE_06,
];

const CDMX_CONDO_SET = [
    // Mexico City skyline / exterior context
    LISTING_IMAGE_03,
    // Modern living area (CDMX)
    LISTING_IMAGE_04,
    // Kitchen (CDMX)
    LISTING_IMAGE_02,
    // Bedroom (modern)
    LISTING_IMAGE_01,
    // Extra “design” interior (neutral, consistent)
    LISTING_IMAGE_03,
];

const CANCUN_SET = [
    // Cancun coastline / hotel zone aerial (strong location cue)
    LISTING_IMAGE_05,
    // Luxury patio / villa exterior
    LISTING_IMAGE_06,
    // Pool/resort
    LISTING_IMAGE_06,
    // Living
    LISTING_IMAGE_03,
    // Bedroom
    LISTING_IMAGE_01,
    // Kitchen
    LISTING_IMAGE_02,
];

const PLAYA_SET = [
    // Tropical house exterior (coastal vibe)
    LISTING_IMAGE_07,
    // Courtyard arches (Mexican character)
    LISTING_IMAGE_02,
    // Living
    LISTING_IMAGE_03,
    // Kitchen
    LISTING_IMAGE_02,
    // Bedroom
    LISTING_IMAGE_01,
    // Pool/garden
    LISTING_IMAGE_06,
];

const COUNTRY_SET = [
    // Country-ish exterior / rustic
    LISTING_IMAGE_08,
    // Warm “home” living
    LISTING_IMAGE_03,
    // Kitchen
    LISTING_IMAGE_02,
    // Bedroom
    LISTING_IMAGE_05,
    // Outdoor / pool-garden vibe
    LISTING_IMAGE_08,
];

const HACIENDA_SET_V2 = [TRAD_ARCH_1, COURTYARD_POOL, RUSTIC_ARCHES, RUSTIC_BRICK_ARCHES, RUSTIC_DINING, RUSTIC_KITCHEN];
const TULUM_VILLA_SET_V2 = [LUXURY_HOLIDAY_HOME, POOL_PALM_TREES, MODERN_LIVING, MODERN_ENTRYWAY, BEDROOM_NATURAL_DECOR, OPEN_PLAN_LIVING];
const CDMX_CONDO_SET_V2 = [URBAN_RESIDENCE, OPEN_PLAN_LIVING, MODERN_LIVING, MODERN_ENTRYWAY, BEDROOM_WOODEN_WINDOWS];
const CANCUN_SET_V2 = [TRAD_ARCH_2, POOL_INFINITY_SUNSET, MODERN_LIVING, BEDROOM_WOODEN_WINDOWS, TRAD_INTERIOR, RUSTIC_DINING];
const PLAYA_SET_V2 = [COLOURFUL_HOUSE_1, COLOURFUL_HOUSE_2, POOL_TROPICAL_PLANTS, FOLKLORE_INTERIOR, BEDROOM_NATURAL_DECOR, RUSTIC_KITCHEN];
const COUNTRY_SET_V2 = [COLOURFUL_TRAD_1, COLOURFUL_TRAD_2, COLOURFUL_TRAD_3, BEDROOM_ADOBE, BEDROOM_SANDSTONE];

// Optional: if you want a single export for all images (not required)
export const LISTING_IMAGES = [
    ...HACIENDA_SET_V2,
    ...TULUM_VILLA_SET_V2,
    ...CDMX_CONDO_SET_V2,
    ...CANCUN_SET_V2,
    ...PLAYA_SET_V2,
    ...COUNTRY_SET_V2,
];

// ------------------ LISTINGS ------------------
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
        image: HACIENDA_SET_V2[0],
        // exterior / courtyard / living / kitchen / bedroom / pool-garden
        photos: [HACIENDA_SET_V2[0], HACIENDA_SET_V2[1], HACIENDA_SET_V2[2], HACIENDA_SET_V2[3], HACIENDA_SET_V2[4], HACIENDA_SET_V2[5]],
        description: {
            en: "Courtyard-centered hacienda with double-height living, hand-finished plaster, and warm quiet light throughout.",
            es: "Hacienda con patio central, sala de doble altura, estuco artesanal y una luz cálida y tranquila.",
        },
        maps: {
            query: "Centro, 97000 Mérida, Yucatán, Mexico",
            displayAddress: "Centro, Mérida, Yucatán",
            postcode: "97000",
        },
    },
    {
        id: "LM-002",
        title: "Villa Agave Verde",
        location: "Tulum",
        priceUSD: 399000,
        beds: 2,
        baths: 2,
        areaM2: 180,
        type: "Villa",
        image: TULUM_VILLA_SET_V2[0],
        // exterior / pool / living / bedroom / kitchen / extra
        photos: [
            TULUM_VILLA_SET_V2[0],
            TULUM_VILLA_SET_V2[1],
            TULUM_VILLA_SET_V2[2],
            TULUM_VILLA_SET_V2[3],
            TULUM_VILLA_SET_V2[4],
            TULUM_VILLA_SET_V2[5],
        ],
        description: {
            en: "Modern tropical villa designed for privacy—clean lines, shaded terraces, and a strong short-term rental flow.",
            es: "Villa tropical moderna diseñada para privacidad—líneas limpias, terrazas sombreadas y buena renta vacacional.",
        },
        maps: {
            query: "Aldea Zama, 77760 Tulum, Quintana Roo, Mexico",
            displayAddress: "Aldea Zama, Tulum, Quintana Roo",
            postcode: "77760",
        },
    },
    {
        id: "LM-003",
        title: "Departamento Centro Histórico",
        location: "Ciudad de México",
        priceUSD: 1265000,
        beds: 4,
        baths: 5,
        areaM2: 692,
        type: "Villa",
        image: CDMX_CONDO_SET_V2[0],
        // skyline / living / kitchen / bedroom / extra
        photos: [CDMX_CONDO_SET_V2[0], CDMX_CONDO_SET_V2[1], CDMX_CONDO_SET_V2[2], CDMX_CONDO_SET_V2[3], CDMX_CONDO_SET_V2[4]],
        description: {
            en: "A walkable central base with timeless materials and practical proportions—ideal as a stable city anchor.",
            es: "Base céntrica y caminable con materiales atemporales y proporciones prácticas—ideal como activo urbano.",
        },
        maps: {
            query: "Centro Histórico, 06000 Ciudad de México, CDMX, Mexico",
            displayAddress: "Centro Histórico, CDMX",
            postcode: "06000",
        },
    },

    {
        id: "LM-005",
        title: "Casa Patio de Crema",
        location: "Playa del Carmen",
        priceUSD: 1315000,
        beds: 5,
        baths: 5,
        areaM2: 465,
        type: "Villa",
        image: PLAYA_SET_V2[0],
        photos: [PLAYA_SET_V2[0], PLAYA_SET_V2[1], PLAYA_SET_V2[2], PLAYA_SET_V2[3], PLAYA_SET_V2[4], PLAYA_SET_V2[5]],
        description: {
            en: "Warm tones, compact courtyard mood, and a slow-living feel—perfect for culture-forward buyers.",
            es: "Tonos cálidos, ambiente de patio y sensación de vida lenta—ideal para compradores amantes de la cultura.",
        },
        maps: {
            query: "Centro, 77710 Playa del Carmen, Quintana Roo, Mexico",
            displayAddress: "Centro, Playa del Carmen, Quintana Roo",
            postcode: "77710",
        },
    },
    {
        id: "LM-006",
        title: "Condo Marina Light",
        location: "Cancún",
        priceUSD: 989000,
        beds: 4,
        baths: 3,
        areaM2: 270,
        type: "Villa",
        image: CANCUN_SET_V2[0],
        photos: [CANCUN_SET_V2[0], CANCUN_SET_V2[1], CANCUN_SET_V2[2], CANCUN_SET_V2[3], CANCUN_SET_V2[4], CANCUN_SET_V2[5]],
        description: {
            en: "Bright marina-side condo with practical layout, strong rental appeal, and effortless lock-and-leave ownership.",
            es: "Condominio luminoso cerca de la marina, distribución práctica y gran potencial de renta.",
        },
        maps: {
            query: "Zona Hotelera, 77500 Cancún, Quintana Roo, Mexico",
            displayAddress: "Zona Hotelera, Cancún, Quintana Roo",
            postcode: "77500",
        },
    },
    {
        id: "LM-007",
        title: "Villa Cenote Breeze",
        location: "Tulum",
        priceUSD: 495000,
        beds: 3,
        baths: 3,
        areaM2: 245,
        type: "Villa",
        image: TULUM_VILLA_SET_V2[1],
        photos: [
            TULUM_VILLA_SET_V2[1],
            TULUM_VILLA_SET_V2[0],
            TULUM_VILLA_SET_V2[2],
            TULUM_VILLA_SET_V2[4],
            TULUM_VILLA_SET_V2[3],
            TULUM_VILLA_SET_V2[5],
        ],
        description: {
            en: "Indoor-outdoor villa with shaded terraces and a calm, private atmosphere designed for long weekends or full seasons.",
            es: "Villa interior-exterior con terrazas sombreadas y ambiente privado para estancias largas o fines de semana.",
        },
        maps: {
            query: "La Veleta, 77760 Tulum, Quintana Roo, Mexico",
            displayAddress: "La Veleta, Tulum, Quintana Roo",
            postcode: "77760",
        },
    },
    {
        id: "LM-008",
        title: "Casa Palm Courtyard",
        location: "Playa del Carmen",
        priceUSD: 349000,
        beds: 3,
        baths: 2,
        areaM2: 210,
        type: "Casa",
        image: PLAYA_SET_V2[1],
        photos: [PLAYA_SET_V2[1], PLAYA_SET_V2[0], PLAYA_SET_V2[2], PLAYA_SET_V2[4], PLAYA_SET_V2[3], PLAYA_SET_V2[5]],
        description: {
            en: "A calm courtyard home with soft materials and an easy everyday rhythm—ideal for buyers who want simplicity with style.",
            es: "Casa con patio tranquilo, materiales suaves y ritmo fácil—ideal para quienes buscan simplicidad con estilo.",
        },
        maps: {
            query: "Zazil Ha, 77720 Playa del Carmen, Quintana Roo, Mexico",
            displayAddress: "Zazil Ha, Playa del Carmen, Quintana Roo",
            postcode: "77720",
        },
    },
    {
        id: "LM-009",
        title: "Hacienda Quiet Arcades",
        location: "Mérida",
        priceUSD: 890000,
        beds: 6,
        baths: 6,
        areaM2: 640,
        type: "Hacienda",
        image: HACIENDA_SET_V2[5],
        photos: [HACIENDA_SET_V2[1], HACIENDA_SET_V2[5], HACIENDA_SET_V2[2], HACIENDA_SET_V2[3], HACIENDA_SET_V2[4], HACIENDA_SET_V2[0]],
        description: {
            en: "Elegant arcades, generous courtyards, and classic proportions—built for families, entertaining, and long-term value.",
            es: "Arquerías elegantes, patios generosos y proporciones clásicas—para familia, eventos y valor a largo plazo.",
        },
        maps: {
            query: "Itzimná, 97100 Mérida, Yucatán, Mexico",
            displayAddress: "Itzimná, Mérida, Yucatán",
            postcode: "97100",
        },
    },
    {
        id: "LM-010",
        title: "Condo Roma Atelier",
        location: "Ciudad de México",
        priceUSD: 315000,
        beds: 1,
        baths: 1,
        areaM2: 78,
        type: "Condo",
        image: CDMX_CONDO_SET_V2[2],
        photos: [CDMX_CONDO_SET_V2[0], CDMX_CONDO_SET_V2[1], CDMX_CONDO_SET_V2[2], CDMX_CONDO_SET_V2[3], CDMX_CONDO_SET_V2[4]],
        description: {
            en: "Design-forward city base with walkability and a clean plan—ideal as a stable anchor with strong long-term demand.",
            es: "Base urbana con diseño, gran caminabilidad y plano limpio—ideal como activo estable con buena demanda.",
        },
        maps: {
            query: "Roma Norte, 06700 Ciudad de México, CDMX, Mexico",
            displayAddress: "Roma Norte, CDMX",
            postcode: "06700",
        },
    },
    {
        id: "LM-011",
        title: "Villa Sunset Canopy",
        location: "Cancún",
        priceUSD: 565000,
        beds: 4,
        baths: 3,
        areaM2: 320,
        type: "Villa",
        image: CANCUN_SET_V2[1],
        photos: [CANCUN_SET_V2[1], CANCUN_SET_V2[2], CANCUN_SET_V2[3], CANCUN_SET_V2[5], CANCUN_SET_V2[4], CANCUN_SET_V2[0]],
        description: {
            en: "A spacious villa with shaded garden zones and easy hosting flow—great for owner use with optional rental strategy.",
            es: "Villa amplia con zonas de sombra y excelente flujo para recibir—ideal para uso personal con opción de renta.",
        },
        maps: {
            query: "Puerto Cancún, 77500 Cancún, Quintana Roo, Mexico",
            displayAddress: "Puerto Cancún, Quintana Roo",
            postcode: "77500",
        },
    },
    {
        id: "LM-012",
        title: "Country House Sierra Quiet",
        location: "Countryside (Yucatán)",
        priceUSD: 455000,
        beds: 3,
        baths: 3,
        areaM2: 260,
        type: "Casa",
        image: COUNTRY_SET_V2[0],
        photos: [COUNTRY_SET_V2[0], COUNTRY_SET_V2[1], COUNTRY_SET_V2[2], COUNTRY_SET_V2[3], COUNTRY_SET_V2[4]],
        description: {
            en: "A countryside escape with soft light, honest materials, and a calm indoor-outdoor rhythm—built for slow mornings and long weekends.",
            es: "Una escapada rural con luz suave, materiales honestos y ritmo interior-exterior—perfecta para mañanas lentas y fines de semana largos.",
        },
        maps: {
            query: "Conkal, 97345 Yucatán, Mexico",
            displayAddress: "Conkal, Yucatán",
            postcode: "97345",
        },
    },
];

export const formatUSD = (n: number) =>
    n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

// ------------------ MAP HELPERS ------------------
export function getMapsQuery(l: Listing) {
    return (l.maps?.query?.trim() || `${l.location}, Mexico`).trim();
}

export function getDisplayAddress(l: Listing) {
    return (l.maps?.displayAddress?.trim() || l.maps?.query?.trim() || `${l.location}, Mexico`).trim();
}

export function getPostcode(l: Listing) {
    return (l.maps?.postcode || "").trim();
}

export function getGoogleMapsUrlForQuery(query: string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getGoogleMapsEmbedUrlForQuery(query: string) {
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}

export function getGoogleMapsUrl(l: Listing) {
    if (typeof l.maps?.lat === "number" && typeof l.maps?.lng === "number") {
        return getGoogleMapsUrlForQuery(`${l.maps.lat},${l.maps.lng}`);
    }
    return getGoogleMapsUrlForQuery(getMapsQuery(l));
}

export function getGoogleMapsEmbedUrl(l: Listing) {
    if (typeof l.maps?.lat === "number" && typeof l.maps?.lng === "number") {
        return getGoogleMapsEmbedUrlForQuery(`${l.maps.lat},${l.maps.lng}`);
    }
    return getGoogleMapsEmbedUrlForQuery(getMapsQuery(l));
}

// ------------------ IMAGE HELPERS ------------------
export function getListingImages(l: Listing) {
    const imgs = [l.image, ...(l.photos || [])].filter(Boolean);
    return Array.from(new Set(imgs));
}
