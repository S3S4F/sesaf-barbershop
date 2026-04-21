"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Trash2, Loader2, Images } from "lucide-react";

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  createdAt: string;
}

export function GalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const fileInput = useRef<HTMLInputElement | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handlePick = () => fileInput.current?.click();

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    setInfo("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (caption.trim()) fd.append("caption", caption.trim());
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      setInfo("Photo ajoutée à la galerie");
      setCaption("");
      fetchPhotos();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette photo de la galerie ?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur");
        return;
      }
      fetchPhotos();
    } catch {
      setError("Erreur de connexion");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImagePlus className="w-5 h-5 text-amber-500" />
            Ajouter une photo client
          </CardTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Partage ton travail (JPG, PNG, WEBP — max 5 Mo). Les photos apparaissent sur <code className="text-amber-400">/galerie</code>.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block">
                Légende (optionnelle)
              </label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="ex. Dégradé + barbe, client Lucas"
                maxLength={120}
              />
            </div>
            <div className="flex items-end">
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = "";
                }}
              />
              <Button
                onClick={handlePick}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Upload…
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4 mr-1" />
                    Choisir une photo
                  </>
                )}
              </Button>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          {info && <p className="text-emerald-400 text-xs mt-2">{info}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Images className="w-5 h-5 text-amber-500" />
            Galerie ({photos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-zinc-800 animate-pulse"
                />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <Images className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">Aucune photo pour l&apos;instant</p>
              <p className="text-zinc-600 text-xs mt-1">
                Ajoute ta première photo ci-dessus
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 group"
                >
                  <Image
                    src={p.url}
                    alt={p.caption ?? "Photo galerie"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    {p.caption && (
                      <p className="text-xs text-white mb-2 line-clamp-2">
                        {p.caption}
                      </p>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="self-start p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
