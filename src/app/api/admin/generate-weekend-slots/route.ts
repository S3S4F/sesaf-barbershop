import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

// Génère les créneaux de 10h à 22h toutes les 1 heure
function generateHourlySlots(): { startTime: string; endTime: string }[] {
  const slots = [];
  for (let hour = 10; hour < 22; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
    slots.push({ startTime, endTime });
  }
  return slots;
}

// Retourne tous les samedis et dimanches d'un mois donné (en UTC)
function getWeekendDaysOfMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(Date.UTC(year, month - 1, d));
    const day = date.getUTCDay();
    if (day === 0 || day === 6) days.push(date);
  }
  return days;
}

// Retourne tous les weekends à partir d'aujourd'hui jusqu'à `monthsAhead` mois
function getUpcomingWeekendDays(monthsAhead: number): Date[] {
  const days: Date[] = [];
  const now = new Date();
  const startYear = now.getUTCFullYear();
  const startMonth = now.getUTCMonth() + 1;
  const today = new Date(Date.UTC(startYear, startMonth - 1, now.getUTCDate()));

  for (let i = 0; i < monthsAhead; i++) {
    const m = ((startMonth - 1 + i) % 12) + 1;
    const y = startYear + Math.floor((startMonth - 1 + i) / 12);
    for (const d of getWeekendDaysOfMonth(y, m)) {
      if (d >= today) days.push(d);
    }
  }
  return days;
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;

  try {
    const body = await request.json();
    const { months, year, monthsAhead } = body as {
      months?: number[];
      year?: number;
      monthsAhead?: number;
    };

    let weekendDays: Date[] = [];
    if (monthsAhead && monthsAhead > 0) {
      weekendDays = getUpcomingWeekendDays(monthsAhead);
    } else if (months && year) {
      for (const month of months) {
        weekendDays.push(...getWeekendDaysOfMonth(year, month));
      }
    } else {
      return NextResponse.json(
        { error: "monthsAhead OU (months + year) requis" },
        { status: 400 }
      );
    }

    const hourly = generateHourlySlots();
    const data: {
      id: string;
      date: Date;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }[] = [];

    for (const day of weekendDays) {
      const dateStr = day.toISOString().slice(0, 10); // yyyy-MM-dd UTC
      for (const { startTime, endTime } of hourly) {
        data.push({
          id: `${dateStr}-${startTime}`,
          date: day,
          startTime,
          endTime,
          isAvailable: true,
        });
      }
    }

    const result = await prisma.timeSlot.createMany({
      data,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} créneaux créés (${data.length - result.count} existaient déjà)`,
      created: result.count,
      total: data.length,
    });
  } catch (error) {
    console.error("Erreur génération créneaux:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
