import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { format, getDaysInMonth } from "date-fns";

// Génère les créneaux de 10h à 22h toutes les 1 heure
function generateSlots(): { startTime: string; endTime: string }[] {
  const slots = [];
  for (let hour = 10; hour < 22; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
    slots.push({ startTime, endTime });
  }
  return slots;
}

// Retourne tous les samedis et dimanches d'un mois donné
function getWeekendDaysOfMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const totalDays = getDaysInMonth(new Date(year, month - 1, 1));
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month - 1, d);
    const day = date.getDay();
    if (day === 0 || day === 6) {
      days.push(date);
    }
  }
  return days;
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const body = await request.json();
    const { months, year } = body as { months: number[]; year: number };

    if (!months || !year) {
      return NextResponse.json({ error: "months et year requis" }, { status: 400 });
    }

    const slots = generateSlots();
    let created = 0;
    let skipped = 0;
    const days: string[] = [];

    for (const month of months) {
      const weekendDays = getWeekendDaysOfMonth(year, month);
      for (const day of weekendDays) {
        const dateStr = format(day, "yyyy-MM-dd");
        const slotDate = new Date(dateStr + "T00:00:00.000Z");
        days.push(dateStr);

        for (const { startTime, endTime } of slots) {
          const id = `${dateStr}-${startTime}`;
          const existing = await prisma.timeSlot.findUnique({ where: { id } });
          if (existing) { skipped++; continue; }
          await prisma.timeSlot.create({
            data: { id, date: slotDate, startTime, endTime, isAvailable: true },
          });
          created++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${created} créneaux créés, ${skipped} existaient déjà`,
      created,
      skipped,
      days,
    });
  } catch (error) {
    console.error("Erreur génération créneaux:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
