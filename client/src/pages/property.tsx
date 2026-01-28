import React from "react";
import { useLocation, useRoute } from "wouter";
import { ChevronLeft, MapPin, BedDouble, Bath, Ruler, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LISTINGS, formatUSD, type Listing } from "@/data/listings";

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

export default function PropertyPage() {
    const [, params] = useRoute("/properties/:id");
    const [, setLocation] = useLocation();

    const id = params?.id;
    const listing = React.useMemo(() => LISTINGS.find((l) => l.id === id), [id]);

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [sending, setSending] = React.useState(false);

    if (!listing) {
        return (
            <div className="min-h-screen bg-[#F5F1EA] text-[#1a1a1a] px-6 py-10">
                <Button variant="outline" className="rounded-none border-black/20" onClick={() => setLocation("/")}>
                    Back home
                </Button>
                <h1 className="mt-8 font-serif text-4xl">Listing not found</h1>
                <p className="mt-2 text-[#5E5E5E]">We couldn’t find a property with ID: {id}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F1EA] text-[#1a1a1a]">
            <div className="px-6 py-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                    <Button variant="outline" className="rounded-none border-black/20" onClick={() => setLocation("/#properties")}>
            <span className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to properties
            </span>
                    </Button>

                    <Button
                        variant="outline"
                        className="rounded-none border-black/20"
                        onClick={() => shareListing(listing)}
                        title="Share listing"
                    >
            <span className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </span>
                    </Button>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
                    <div className="bg-white border border-black/10 overflow-hidden">
                        <img src={listing.photos?.[0] ?? listing.image} alt={listing.title} className="w-full h-[420px] object-cover" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 bg-white">
                            {(listing.photos ?? [listing.image]).slice(0, 4).map((src, i) => (
                                <img key={i} src={src} alt={`${listing.title} ${i + 1}`} className="h-28 w-full object-cover" />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-black/10 p-8">
                        <div className="text-[10px] tracking-[0.26em] uppercase text-[#5E5E5E]">
                            {listing.type} • {listing.id}
                        </div>

                        <h1 className="mt-2 font-serif text-4xl">{listing.title}</h1>

                        <div className="mt-3 flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#5E5E5E]">
                            <MapPin className="w-3.5 h-3.5" />
                            {listing.location}
                        </div>

                        <div className="mt-6 text-2xl font-medium">{formatUSD(listing.priceUSD)}</div>

                        <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#5E5E5E]">
              <span className="flex items-center gap-2">
                <BedDouble className="w-4 h-4" /> {listing.beds} beds
              </span>
                            <span className="flex items-center gap-2">
                <Bath className="w-4 h-4" /> {listing.baths} baths
              </span>
                            <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4" /> {listing.areaM2} m²
              </span>
                        </div>

                        <p className="mt-8 text-[#5E5E5E] leading-relaxed">{listing.description.en}</p>

                        <div className="mt-10 border-t border-black/10 pt-6">
                            <div className="text-[10px] tracking-[0.26em] uppercase text-[#5E5E5E]">Inquiry</div>

                            <div className="mt-4 space-y-3">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full border border-black/10 px-3 py-2"
                                />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    type="email"
                                    className="w-full border border-black/10 px-3 py-2"
                                />
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`Message about ${listing.title}...`}
                                    rows={4}
                                    className="w-full border border-black/10 px-3 py-2"
                                />
                                <Button
                                    disabled={sending}
                                    className="w-full bg-[#1a1a1a] hover:bg-[#B78454] text-white rounded-none py-6 uppercase tracking-widest text-xs"
                                    onClick={async () => {
                                        try {
                                            setSending(true);
                                            await sendInquiry({
                                                name: name.trim(),
                                                email: email.trim(),
                                                message: message.trim(),
                                                listingId: listing.id,
                                            });
                                            setMessage("");
                                            alert("Sent! We'll get back to you soon.");
                                        } catch (err: any) {
                                            alert(err?.message || "Failed to send. Please try again.");
                                        } finally {
                                            setSending(false);
                                        }
                                    }}
                                >
                                    {sending ? "SENDING..." : "SEND INQUIRY"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
