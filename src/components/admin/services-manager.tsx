"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { resolveServiceImage } from "@/lib/service-images";
import { Scissors, ImagePlus, Trash2, Loader2, CheckCircle2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string | null;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; text: string; ok: boolean } | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleUpload = async (id: string, file: File) => {
    setUploadingId(id);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/services/${id}/image`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ id, text: data.error ?? "Erreur", ok: false });
        return;
      }
      setMessage({ id, text: "Image mise à jour", ok: true });
      fetchServices();
    } catch {
      setMessage({ id, text: "Erreur de connexion", ok: false });
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    setUploadingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/services/${id}/image`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ id, text: data.error ?? "Erreur", ok: false });
        return;
      }
      setMessage({ id, text: "Image supprimée", ok: true });
      fetchServices();
    } catch {
      setMessage({ id, text: "Erreur de connexion", ok: false });
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-amber-500" />
          Images des prestations
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          Remplace les images par défaut par tes propres photos (JPG, PNG, WEBP — max 5 Mo).
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">
            Aucun service. Lance le seed d&apos;abord.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((s) => {
              const img = resolveServiceImage(s.name, s.imageUrl);
              const isUploading = uploadingId === s.id;
              const hasCustom = Boolean(s.imageUrl);
              return (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row gap-3 p-3 bg-zinc-800/50 rounded-xl"
                >
                  <div className="relative w-full sm:w-28 aspect-[4/5] sm:aspect-square shrink-0 rounded-lg overflow-hidden bg-zinc-900">
                    <Image
                      src={img}
                      alt={s.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 112px"
                      className="object-cover"
                    />
                    {hasCustom && (
                      <div className="absolute top-1 right-1 bg-emerald-600/90 rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatPrice(s.price)} · {s.duration} min
                        </p>
                      </div>
                      <Badge className="text-[10px] shrink-0">
                        {hasCustom ? "Perso" : "Par défaut"}
                      </Badge>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                      <input
                        ref={(el) => {
                          fileInputs.current[s.id] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(s.id, f);
                          e.target.value = "";
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUploading}
                        onClick={() => fileInputs.current[s.id]?.click()}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            Upload…
                          </>
                        ) : (
                          <>
                            <ImagePlus className="w-3.5 h-3.5 mr-1" />
                            {hasCustom ? "Remplacer" : "Uploader"}
                          </>
                        )}
                      </Button>
                      {hasCustom && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isUploading}
                          onClick={() => handleRemove(s.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1 text-red-400" />
                          Retirer
                        </Button>
                      )}
                    </div>

                    {message && message.id === s.id && (
                      <p
                        className={`text-xs mt-2 ${
                          message.ok ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
