import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Le paramètre 'date' est requis" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: "Format de date invalide. Utilisez YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr + "T00:00:00.000Z");
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      include: {
        bookings: {
          where: {
            status: { not: "CANCELLED" },
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Mark slots as unavailable if they have active bookings
    const slotsWithAvailability = timeSlots.map((slot) => ({
      id: slot.id,
      date: slot.date.toISOString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable && slot.bookings.length === 0,
    }));

    return NextResponse.json(slotsWithAvailability);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des créneaux" },
      { status: 500 }
    );
  }
}
