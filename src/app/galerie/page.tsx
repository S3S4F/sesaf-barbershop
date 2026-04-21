import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/home/fade-in";
import { Calendar, Images } from "lucide-react";

export const dynamic = "force-dynamic";

async function getPhotos() {
  try {
    return await prisma.galleryPhoto.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { id: true, url: true, caption: true },
    });
  } catch {
    return [];
  }
}

export default async function GaleriePage() {
  const photos = await getPhotos();

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <Badge>Galerie</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Mes <span className="text-amber-400">réalisations</span>
          </h1>
          <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
            Un aperçu des coupes fraîches de mes clients — dégradés, tapers,
            designs et plus encore.
          </p>
        </FadeIn>

        {photos.length === 0 ? (
          <FadeIn>
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Images className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400 mb-2">La galerie se remplit bientôt</p>
              <p className="text-zinc-600 text-sm mb-8">
                Reviens vite pour voir les dernières coupes !
              </p>
              <Link href="/booking">
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Réserver ma coupe
                </Button>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <>
            <FadeIn>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group"
                  >
                    <div className="relative w-full">
                      <Image
                        src={p.url}
                        alt={p.caption ?? "Réalisation"}
                        width={600}
                        height={800}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    {p.caption && (
                      <div className="p-3">
                        <p className="text-zinc-300 text-sm">{p.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="text-center mt-16">
                <p className="text-zinc-400 mb-4">Envie de la même fraîcheur ?</p>
                <Link href="/booking">
                  <Button size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver maintenant
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </>
        )}
      </div>
    </div>
  );
}
