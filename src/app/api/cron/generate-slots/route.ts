import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { addDays, format, nextSaturday, nextSunday, startOfDay } from "date-fns";

// Génère les créneaux de 11h à 20h toutes les 30 minutes
function generateWeekendSlots(): { startTime: string; endTime: string }[] {
  const slots = [];
  for (let hour = 11; hour < 20; hour++) {
    for (const min of [0, 30]) {
      const startTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const endMinutes = min + 30;
      const endHour = endMinutes === 60 ? hour + 1 : hour;
      const endMin = endMinutes === 60 ? 0 : endMinutes;
      const endTime = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
      slots.push({ startTime, endTime });
    }
  }
  return slots;
}

// Trouve les prochains weekends (samedi + dimanche) sur N semaines
function getUpcomingWeekendDays(weeksAhead: number = 4): Date[] {
  const days: Date[] = [];
  const today = startOfDay(new Date());

  for (let w = 0; w <= weeksAhead; w++) {
    const base = addDays(today, w * 7);
    // Samedi
    const sat = nextSaturday(addDays(base, -1));
    if (sat >= today) days.push(sat);
    // Dimanche
    const sun = nextSunday(addDays(base, -1));
    if (sun >= today) days.push(sun);
  }

  // Dédoublonner par date string
  const seen = new Set<string>();
  return days.filter((d) => {
    const key = format(d, "yyyy-MM-dd");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(request: NextRequest) {
  // Vérification du secret cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const weekendDays = getUpcomingWeekendDays(4);
    let created = 0;
    let skipped = 0;

    for (const day of weekendDays) {
      const dateStr = format(day, "yyyy-MM-dd");
      const slotDate = new Date(dateStr + "T00:00:00.000Z");
      const timeSlots = generateWeekendSlots();

      for (const { startTime, endTime } of timeSlots) {
        const id = `${dateStr}-${startTime}`;
        const existing = await prisma.timeSlot.findUnique({ where: { id } });
        if (existing) {
          skipped++;
          continue;
        }
        await prisma.timeSlot.create({
          data: { id, date: slotDate, startTime, endTime, isAvailable: true },
        });
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${created} créneaux créés, ${skipped} existaient déjà`,
      created,
      skipped,
      days: weekendDays.map((d) => format(d, "yyyy-MM-dd")),
    });
  } catch (error) {
    console.error("Erreur génération créneaux weekend:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
