import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Marque automatiquement comme COMPLETED les réservations CONFIRMED dont l'heure est passée
export async function GET(request: NextRequest) {
  // Vérification du secret cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    // Récupérer les réservations CONFIRMED avec créneau passé
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        timeSlot: {
          OR: [
            // Date passée (avant aujourd'hui)
            { date: { lt: new Date(today + "T00:00:00.000Z") } },
            // Aujourd'hui mais heure de fin dépassée
            {
              date: {
                gte: new Date(today + "T00:00:00.000Z"),
                lt: new Date(today + "T23:59:59.999Z"),
              },
              endTime: { lte: currentTime },
            },
          ],
        },
      },
      select: { id: true },
    });

    if (expiredBookings.length === 0) {
      return NextResponse.json({ success: true, updated: 0, message: "Rien à mettre à jour" });
    }

    const ids = expiredBookings.map((b) => b.id);
    const result = await prisma.booking.updateMany({
      where: { id: { in: ids } },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
      message: `${result.count} réservation(s) marquée(s) comme terminée(s)`,
    });
  } catch (error) {
    console.error("Erreur mise à jour réservations:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
