import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    LISTINGS,
    formatUSD,
    getDisplayAddress,
    getGoogleMapsEmbedUrl,
    getGoogleMapsUrl,
    getListingImages,
    getPostcode,
    type Listing,
} from "@/data/listings";

type Lang = "en" | "es";

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
        // ignore
    }

    try {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
    } catch {
        prompt("Copy this link:", url);
    }
}

export default function PropertyPage() {
    const [, setLocation] = useLocation();
    const [, params] = useRoute("/properties/:id");
    const id = params?.id;

    const [lang, setLang] = useState<Lang>("en");

    // ✅ FIX: always open listing pages at TOP
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // extra: prevent browser scroll restoration from pushing you somewhere weird
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, [id]);

    const listing = useMemo(() => LISTINGS.find((l) => l.id === id), [id]);

    const images = useMemo(() => (listing ? getListingImages(listing) : []), [listing]);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        setIdx(0);
    }, [id]);

    const postcode = listing ? getPostcode(listing) : "";
    const address = listing ? getDisplayAddress(listing) : "";

    const next = () => setIdx((p) => (images.length ? (p + 1) % images.length : 0));
    const prev = () => setIdx((p) => (images.length ? (p - 1 + images.length) % images.length : 0));

    if (!listing) {
        return (
            <div className="min-h-screen bg-[#F5F1EA] text-[#1a1a1a]">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    <Button className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white" onClick={() => setLocation("/")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    <div className="mt-10 border border-black/10 bg-white p-10">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Not found</div>
                        <div className="mt-2 font-serif text-3xl">Property not found.</div>
                        <p className="mt-4 text-black/60">This listing ID doesn’t exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F1EA] text-[#1a1a1a]">
            {/* Top bar */}
            <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-black/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <button
                        onClick={() => setLocation("/")}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-black/70 hover:text-[#B78454] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </button>

                    <div className="flex items-center gap-2 text-xs font-medium tracking-widest">
                        <button onClick={() => setLang("en")} className={lang === "en" ? "opacity-100" : "opacity-40"}>
                            EN
                        </button>
                        <span className="opacity-30">/</span>
                        <button onClick={() => setLang("es")} className={lang === "es" ? "opacity-100" : "opacity-40"}>
                            ES
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">
                            {listing.type} • {listing.id}
                        </div>
                        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{listing.title}</h1>

                        {/* ✅ Clickable location + postcode */}
                        <a
                            href={getGoogleMapsUrl(listing)}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-black/60 hover:text-[#B78454] transition-colors"
                            title="Open in Google Maps"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>
                {listing.location}
                                {postcode ? ` • ${postcode}` : ""}
              </span>
                        </a>

                        {/* ✅ Show the “real” sensible address text */}
                        {address && (
                            <div className="mt-2 text-sm text-black/60">
                                {address}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            className="rounded-none bg-white text-black border border-black/10 hover:border-black/30"
                            onClick={() => shareListing(listing)}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>

                        <Button className="rounded-none bg-[#1a1a1a] hover:bg-[#B78454] text-white">
                            {formatUSD(listing.priceUSD)}
                        </Button>
                    </div>
                </div>

                {/* ✅ HERO SLIDESHOW (replaces Gallery section completely) */}
                <div className="mt-8 border border-black/10 bg-white overflow-hidden">
                    <div className="relative aspect-[16/9] bg-black">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={images[idx] || listing.image}
                                src={images[idx] || listing.image}
                                alt={listing.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0.4, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0.4, scale: 1.02 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />

                        {/* Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/60 text-white border border-white/15 p-2"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/60 text-white border border-white/15 p-2"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/55 text-white text-[10px] tracking-[0.28em] uppercase px-3 py-2 border border-white/15">
                            {images.length ? `${idx + 1} / ${images.length}` : "1 / 1"}
                        </div>
                    </div>

                    {/* Thumbs (still part of slideshow, not “gallery section”) */}
                    {images.length > 1 && (
                        <div className="border-t border-black/10 bg-[#F5F1EA] p-3">
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((src, i) => (
                                    <button
                                        key={src}
                                        onClick={() => setIdx(i)}
                                        className={`h-16 w-24 flex-none overflow-hidden border ${i === idx ? "border-[#B78454]" : "border-black/10 hover:border-black/30"} bg-white`}
                                        title={`Image ${i + 1}`}
                                    >
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 border border-black/10 bg-white p-6">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Description</div>
                        <p className="mt-4 text-black/70 leading-relaxed">{listing.description[lang]}</p>

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            {[
                                { label: "Beds", value: listing.beds },
                                { label: "Baths", value: listing.baths },
                                { label: "Area", value: `${listing.areaM2} m²` },
                            ].map((x) => (
                                <div key={x.label} className="border border-black/10 bg-[#F5F1EA] p-4">
                                    <div className="text-[10px] tracking-[0.26em] uppercase text-black/60">{x.label}</div>
                                    <div className="mt-2 font-medium">{x.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-black/10 bg-white p-6">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Location</div>

                        <div className="mt-4 text-sm text-black/70">
                            <div className="font-medium text-black">{listing.location}</div>
                            {postcode && <div className="mt-1 text-black/60">Postcode: {postcode}</div>}
                            {address && <div className="mt-2 text-black/60">{address}</div>}
                        </div>

                        <a
                            href={getGoogleMapsUrl(listing)}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex w-full items-center justify-center border border-black/10 bg-[#1a1a1a] text-white px-4 py-3 text-xs tracking-[0.22em] uppercase hover:bg-[#B78454] transition-colors"
                        >
                            Open in Google Maps
                        </a>
                    </div>
                </div>

                {/* ✅ Interactive map */}
                <div className="mt-8 border border-black/10 bg-white overflow-hidden">
                    <div className="p-6 border-b border-black/10">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Interactive map</div>
                        <div className="mt-2 text-sm text-black/60">Tap/drag/zoom — opens the exact area in Maps.</div>
                    </div>

                    <div className="aspect-[16/9] bg-black">
                        <iframe
                            title={`Map for ${listing.title}`}
                            src={getGoogleMapsEmbedUrl(listing)}
                            className="w-full h-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-10 border border-black/10 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Next step</div>
                        <div className="mt-2 font-serif text-2xl">Want availability & a private walkthrough?</div>
                        <div className="mt-2 text-sm text-black/60">Message us and we’ll respond with next steps.</div>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href="mailto:lamaisonmexico@gmail.com"
                            className="inline-flex items-center justify-center border border-black/10 bg-white text-black px-6 py-4 text-xs tracking-[0.22em] uppercase hover:border-black/30 transition-colors"
                        >
                            Email
                        </a>
                        <a
                            href="https://wa.me/34667640713"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center border border-black/10 bg-[#1a1a1a] text-white px-6 py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#B78454] transition-colors"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>

                <div className="h-10" />
            </div>
        </div>
    );
}

