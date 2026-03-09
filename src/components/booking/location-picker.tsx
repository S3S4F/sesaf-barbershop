"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Home, Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn, haversineDistance, calculateDeliveryFee } from "@/lib/utils";

interface LocationPickerProps {
  locationType: "SALON" | "DOMICILE";
  onLocationTypeChange: (type: "SALON" | "DOMICILE") => void;
  address: string;
  onAddressChange: (address: string) => void;
  onLocationConfirm: (data: {
    address: string;
    latitude: number;
    longitude: number;
    distance: number;
    deliveryFee: number;
  }) => void;
  distance: number | null;
  deliveryFee: number | null;
}

const ARANCETTE_LAT = 43.4833;
const ARANCETTE_LNG = -1.4833;

export function LocationPicker({
  locationType,
  onLocationTypeChange,
  address,
  onAddressChange,
  onLocationConfirm,
  distance,
  deliveryFee,
}: LocationPickerProps) {
  const [suggestions, setSuggestions] = useState<Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>>([]);
  const [searching, setSearching] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Recherche d'adresse via Nominatim (OpenStreetMap, gratuit)
  useEffect(() => {
    if (locationType !== "DOMICILE" || address.length < 4) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address + " Bayonne France"
          )}&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "fr" } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [address, locationType]);

  const handleSelectAddress = (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const dist = haversineDistance(lat, lng);
    const fee = calculateDeliveryFee(dist);

    onAddressChange(suggestion.display_name);
    onLocationConfirm({
      address: suggestion.display_name,
      latitude: lat,
      longitude: lng,
      distance: Math.round(dist * 10) / 10,
      deliveryFee: fee,
    });
    setSuggestions([]);
    setConfirmed(true);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <MapPin className="w-4 h-4 text-amber-500" />
        Où souhaites-tu te faire coiffer ?
      </h3>

      {/* Toggle Salon / Domicile */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            onLocationTypeChange("SALON");
            setConfirmed(false);
          }}
          className={cn(
            "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200",
            locationType === "SALON"
              ? "border-amber-500 bg-amber-950/20"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          )}
        >
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              locationType === "SALON"
                ? "bg-amber-600/20"
                : "bg-zinc-800"
            )}
          >
            <Building2
              className={cn(
                "w-7 h-7",
                locationType === "SALON" ? "text-amber-400" : "text-zinc-500"
              )}
            />
          </div>
          <div className="text-center">
            <p className={cn("font-semibold text-sm", locationType === "SALON" ? "text-white" : "text-zinc-400")}>
              Au salon
            </p>
            <p className="text-xs text-zinc-500 mt-1">Bât D, Arancette</p>
          </div>
        </button>

        <button
          onClick={() => {
            onLocationTypeChange("DOMICILE");
            setConfirmed(false);
          }}
          className={cn(
            "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200",
            locationType === "DOMICILE"
              ? "border-amber-500 bg-amber-950/20"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          )}
        >
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              locationType === "DOMICILE"
                ? "bg-amber-600/20"
                : "bg-zinc-800"
            )}
          >
            <Home
              className={cn(
                "w-7 h-7",
                locationType === "DOMICILE" ? "text-amber-400" : "text-zinc-500"
              )}
            />
          </div>
          <div className="text-center">
            <p className={cn("font-semibold text-sm", locationType === "DOMICILE" ? "text-white" : "text-zinc-400")}>
              À domicile
            </p>
            <p className="text-xs text-zinc-500 mt-1">+0,35€/km</p>
          </div>
        </button>
      </div>

      {/* Salon info */}
      {locationType === "SALON" && (
        <Card className="border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Résidence Arancette, Bât D</p>
                <p className="text-zinc-500 text-xs mt-0.5">Bayonne, 64100</p>
              </div>
            </div>
            {/* Map embed - salon location */}
            <div className="mt-3 rounded-xl overflow-hidden h-40">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${ARANCETTE_LNG - 0.005}%2C${ARANCETTE_LAT - 0.003}%2C${ARANCETTE_LNG + 0.005}%2C${ARANCETTE_LAT + 0.003}&layer=mapnik&marker=${ARANCETTE_LAT}%2C${ARANCETTE_LNG}`}
                className="w-full h-full border-0"
                title="Localisation du salon"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domicile address input */}
      {locationType === "DOMICILE" && (
        <div className="space-y-3">
          <label className="block text-sm text-zinc-400">
            Ton adresse *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="12 rue de la République, Bayonne..."
              value={address}
              onChange={(e) => {
                onAddressChange(e.target.value);
                setConfirmed(false);
              }}
              className="pl-10"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 animate-spin" />
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !confirmed && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAddress(s)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors flex items-start gap-3"
                >
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-300 text-sm line-clamp-2">
                    {s.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Distance & frais */}
          {confirmed && distance !== null && deliveryFee !== null && (
            <Card className="border-amber-600/30 bg-amber-950/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-amber-500" />
                    <span className="text-zinc-400 text-sm">
                      Distance : <span className="text-white font-medium">{distance} km</span>
                    </span>
                  </div>
                  <span className="text-amber-400 font-semibold">
                    +{(deliveryFee / 100).toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
