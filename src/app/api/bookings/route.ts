import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { sendBookingConfirmation } from "@/lib/email";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      }
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { customerName, customerEmail, customerPhone, serviceId, timeSlotId, notes, locationType, address, distance, deliveryFee } =
      parsed.data;

    // Vérifier que le service existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que le créneau existe et est disponible
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
      include: {
        bookings: {
          where: { status: { not: "CANCELLED" } },
        },
      },
    });

    if (!timeSlot) {
      return NextResponse.json(
        { error: "Créneau introuvable" },
        { status: 404 }
      );
    }

    if (!timeSlot.isAvailable || timeSlot.bookings.length > 0) {
      return NextResponse.json(
        { error: "Ce créneau n'est plus disponible. Choisis un autre créneau." },
        { status: 409 }
      );
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        serviceId,
        timeSlotId,
        locationType: locationType || "SALON",
        address: address || null,
        distance: distance || null,
        deliveryFee: deliveryFee || 0,
        notes: notes || null,
        status: "CONFIRMED",
      },
      include: {
        service: true,
        timeSlot: true,
      },
    });

    // Envoyer email de confirmation
    const totalPrice = service.price + (deliveryFee || 0);
    await sendBookingConfirmation({
      customerName,
      customerEmail,
      serviceName: service.name,
      date: format(timeSlot.date, "EEEE d MMMM yyyy", { locale: fr }),
      time: timeSlot.startTime,
      price: totalPrice,
      locationType: locationType || "SALON",
      address: address || undefined,
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        customerName: booking.customerName,
        service: booking.service.name,
        date: format(booking.timeSlot.date, "EEEE d MMMM yyyy", { locale: fr }),
        time: booking.timeSlot.startTime,
        price: totalPrice,
        locationType: booking.locationType,
        address: booking.address,
        distance: booking.distance,
        deliveryFee: booking.deliveryFee,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Erreur création réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateStr = searchParams.get("date");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (dateStr) {
      const date = new Date(dateStr + "T00:00:00.000Z");
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.timeSlot = {
        date: { gte: date, lt: nextDay },
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        timeSlot: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}
