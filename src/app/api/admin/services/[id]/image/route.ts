import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { uploadImage, deleteBlob } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  const { id } = await context.params;

  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const uploaded = await uploadImage(file, `services/${id}`);

    // Si l'ancien image était un blob vercel, on essaie de le supprimer
    if (service.imageUrl && service.imageUrl.includes(".blob.vercel-storage.com")) {
      await deleteBlob(service.imageUrl);
    }

    const updated = await prisma.service.update({
      where: { id },
      data: { imageUrl: uploaded.url },
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'upload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  const { id } = await context.params;

  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    if (service.imageUrl && service.imageUrl.includes(".blob.vercel-storage.com")) {
      await deleteBlob(service.imageUrl);
    }

    const updated = await prisma.service.update({
      where: { id },
      data: { imageUrl: null },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}
