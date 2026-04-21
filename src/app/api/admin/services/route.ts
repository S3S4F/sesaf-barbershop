import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services" },
      { status: 500 }
    );
  }
}
