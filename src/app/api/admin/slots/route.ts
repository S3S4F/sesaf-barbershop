import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    const where: Record<string, unknown> = {};
    if (dateStr) {
      const date = new Date(dateStr + "T00:00:00.000Z");
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: date, lt: nextDay };
    } else {
      // Par défaut, les 30 prochains jours
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.date = { gte: today };
    }

    const slots = await prisma.timeSlot.findMany({
      where,
      include: {
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: { id: true, customerName: true, status: true },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(slots);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des créneaux" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const body = await request.json();
    const { date, startTime, endTime } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Date, heure de début et heure de fin requises" },
        { status: 400 }
      );
    }

    const slotDate = new Date(date + "T00:00:00.000Z");
    const id = `${date}-${startTime}`;

    const existing = await prisma.timeSlot.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json(
        { error: "Ce créneau existe déjà" },
        { status: 409 }
      );
    }

    const slot = await prisma.timeSlot.create({
      data: {
        id,
        date: slotDate,
        startTime,
        endTime,
        isAvailable: true,
      },
    });

    return NextResponse.json(slot);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du créneau" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID du créneau requis" },
        { status: 400 }
      );
    }

    // Vérifier pas de réservation active
    const slot = await prisma.timeSlot.findUnique({
      where: { id },
      include: { bookings: { where: { status: { not: "CANCELLED" } } } },
    });

    if (!slot) {
      return NextResponse.json(
        { error: "Créneau introuvable" },
        { status: 404 }
      );
    }

    if (slot.bookings.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer un créneau avec des réservations actives" },
        { status: 409 }
      );
    }

    await prisma.timeSlot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du créneau" },
      { status: 500 }
    );
  }
}
