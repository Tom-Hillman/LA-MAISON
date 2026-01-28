import React, { useMemo } from "react";
import { useRoute } from "wouter";
import { ArrowLeft, BedDouble, Bath, Ruler, MapPin, Share2 } from "lucide-react";
import { LISTINGS, formatUSD } from "@/data/listings";
import { Button } from "@/components/ui/button";

async function shareUrl(url: string, title: string) {
    try {
        if (navigator.share) {
            await navigator.share({ title, url });
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

export default function PropertyPage() {
    const [match, params] = useRoute("/properties/:id");
    const id = match ? params?.id : undefined;

    const listing = useMemo(() => LISTINGS.find((x) => x.id === id), [id]);

    if (!listing) {
        return (
            <div className="min-h-screen bg-[#F5F1EA] text-[#1a1a1a] p-6">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={() => window.history.back()} className="rounded-none">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="mt-10 font-serif text-3xl">Listing not found</div>
                    <p className="mt-3 text-black/60">The listing you opened doesn’t exist (or was removed).</p>
                </div>
            </div>
        );
    }

    const url = typeof window !== "undefined" ? `${window.location.origin}/properties/${listing.id}` : "";

    return (
        <div className="min-h-screen bg-[#F5F1EA] text-[#1a1a1a]">
            {/* Top bar */}
            <div className="sticky top-0 z-50 bg-[#F5F1EA]/90 backdrop-blur-md border-b border-black/10">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => window.history.back()} className="rounded-none">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60 hidden md:block">
                        {listing.type} • {listing.id}
                    </div>

                    <Button
                        variant="ghost"
                        className="rounded-none"
                        onClick={() => shareUrl(url, `${listing.title} — ${listing.id}`)}
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Hero image */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
                <div className="overflow-hidden border border-black/10 bg-white">
                    <img src={listing.photos?.[0] || listing.image} alt={listing.title} className="w-full h-[42vh] md:h-[56vh] object-cover" />
                </div>

                {/* Title */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">
                            {listing.type} • {listing.id}
                        </div>
                        <div className="mt-3 font-serif text-3xl md:text-5xl">{listing.title}</div>
                        <div className="mt-3 flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-black/60">
                            <MapPin className="w-4 h-4" />
                            {listing.location}
                        </div>
                    </div>

                    <div className="border border-black/10 bg-white px-6 py-5">
                        <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Price</div>
                        <div className="mt-2 text-2xl md:text-3xl font-medium">{formatUSD(listing.priceUSD)}</div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-black/10 bg-white p-5 flex items-center gap-3">
                        <BedDouble className="w-5 h-5 text-black/60" />
                        <div>
                            <div className="text-xs tracking-[0.22em] uppercase text-black/60">Bedrooms</div>
                            <div className="mt-1 text-lg">{listing.beds}</div>
                        </div>
                    </div>
                    <div className="border border-black/10 bg-white p-5 flex items-center gap-3">
                        <Bath className="w-5 h-5 text-black/60" />
                        <div>
                            <div className="text-xs tracking-[0.22em] uppercase text-black/60">Bathrooms</div>
                            <div className="mt-1 text-lg">{listing.baths}</div>
                        </div>
                    </div>
                    <div className="border border-black/10 bg-white p-5 flex items-center gap-3">
                        <Ruler className="w-5 h-5 text-black/60" />
                        <div>
                            <div className="text-xs tracking-[0.22em] uppercase text-black/60">Area</div>
                            <div className="mt-1 text-lg">{listing.areaM2} m²</div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-10 border border-black/10 bg-white p-7 md:p-10">
                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60">Overview</div>
                    <p className="mt-4 text-black/70 leading-relaxed">{listing.description.en}</p>
                </div>

                {/* Gallery */}
                <div className="mt-10 pb-16">
                    <div className="text-[10px] tracking-[0.28em] uppercase text-black/60 mb-4">Gallery</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(listing.photos || []).slice(0, 8).map((p, idx) => (
                            <div key={p + idx} className="overflow-hidden border border-black/10 bg-white">
                                <img src={p} alt={`${listing.title} photo ${idx + 1}`} className="w-full h-40 md:h-44 object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
