import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { id: true, url: true, caption: true, createdAt: true },
    });
    return NextResponse.json(photos);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la galerie" },
      { status: 500 }
    );
  }
}
