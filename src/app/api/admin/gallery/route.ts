import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { uploadImage, deleteBlob } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(photos);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la galerie" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const caption = (formData.get("caption") as string | null) ?? null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const uploaded = await uploadImage(file, "gallery");

    const photo = await prisma.galleryPhoto.create({
      data: {
        url: uploaded.url,
        caption: caption && caption.length > 0 ? caption : null,
      },
    });

    return NextResponse.json(photo);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'upload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
    }

    if (photo.url.includes(".blob.vercel-storage.com")) {
      await deleteBlob(photo.url);
    }

    await prisma.galleryPhoto.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
