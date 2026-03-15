"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Scissors,
  Mail,
  Home,
  ArrowLeft,
  CalendarPlus,
} from "lucide-react";

function buildGoogleCalendarUrl(
  service: string,
  rawDate: string,
  startTime: string,
  endTime: string
) {
  // Format: YYYYMMDDTHHMMSS
  const start = `${rawDate.replace(/-/g, "")}T${startTime.replace(":", "")}00`;
  const end = `${rawDate.replace(/-/g, "")}T${endTime.replace(":", "")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `SESAF Barbershop - ${service}`,
    dates: `${start}/${end}`,
    details: "Rendez-vous chez SESAF Barbershop. Présente-toi 5 minutes avant.",
    location: "Residence Arancette, Bat D, 64100 Bayonne, France",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl(
  service: string,
  rawDate: string,
  startTime: string,
  endTime: string
) {
  const startIso = `${rawDate}T${startTime}:00`;
  const endIso = `${rawDate}T${endTime}:00`;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `SESAF Barbershop - ${service}`,
    startdt: startIso,
    enddt: endIso,
    body: "Rendez-vous chez SESAF Barbershop. Présente-toi 5 minutes avant.",
    location: "Residence Arancette, Bat D, 64100 Bayonne, France",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function buildIcsContent(
  service: string,
  rawDate: string,
  startTime: string,
  endTime: string,
  bookingId: string
) {
  const start = `${rawDate.replace(/-/g, "")}T${startTime.replace(":", "")}00`;
  const end = `${rawDate.replace(/-/g, "")}T${endTime.replace(":", "")}00`;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SESAF Barbershop//FR",
    "BEGIN:VEVENT",
    `UID:${bookingId}@sesaf-barbershop`,
    `DTSTAMP:${now}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:SESAF Barbershop - ${service}`,
    "DESCRIPTION:Rendez-vous chez SESAF Barbershop. Présente-toi 5 minutes avant.",
    "LOCATION:Residence Arancette\\, Bat D\\, 64100 Bayonne\\, France",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const service = searchParams.get("service") || "";
  const date = searchParams.get("date") || "";
  const rawDate = searchParams.get("rawDate") || "";
  const time = searchParams.get("time") || "";
  const endTime = searchParams.get("endTime") || "";
  const price = searchParams.get("price") || "0";
  const id = searchParams.get("id") || "";

  const hasCalendarData = rawDate && time && endTime;

  const handleDownloadIcs = () => {
    const ics = buildIcsContent(service, rawDate, time, endTime, id);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sesaf-barbershop.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-zinc-400">
            Merci {name} ! Un email de confirmation a été envoyé.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">Réservation</span>
              <Badge variant="success">Confirmée</Badge>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-600/10 rounded-xl flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Service</p>
                  <p className="text-white font-medium text-sm">{service}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-600/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Date</p>
                  <p className="text-white font-medium text-sm capitalize">
                    {date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-600/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Heure</p>
                  <p className="text-white font-medium text-sm">{time}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total</span>
                <span className="text-2xl font-bold text-amber-400">
                  {(parseInt(price) / 100).toFixed(2).replace(".", ",")}€
                </span>
              </div>
            </div>

            {id && (
              <div className="pt-2">
                <p className="text-xs text-zinc-600 text-center">
                  Référence : {id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ajouter au calendrier */}
        {hasCalendarData && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CalendarPlus className="w-5 h-5 text-amber-500" />
              <p className="text-white text-sm font-medium">
                Ajouter à mon calendrier
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={buildGoogleCalendarUrl(service, rawDate, time, endTime)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#4285F4" strokeWidth="1.5"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
                  <text x="12" y="19" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#4285F4">G</text>
                </svg>
                <span className="text-xs text-zinc-400">Google</span>
              </a>

              <button
                onClick={handleDownloadIcs}
                className="flex flex-col items-center gap-1.5 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#ffffff" strokeWidth="1.5"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                  <text x="12" y="19" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#ffffff">ICS</text>
                </svg>
                <span className="text-xs text-zinc-400">Apple</span>
              </button>

              <a
                href={buildOutlookUrl(service, rawDate, time, endTime)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0078D4" strokeWidth="1.5"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round"/>
                  <text x="12" y="19" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#0078D4">OUT</text>
                </svg>
                <span className="text-xs text-zinc-400">Outlook</span>
              </a>
            </div>
          </div>
        )}

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">
                Email de confirmation
              </p>
              <p className="text-zinc-500 text-xs">
                Un email avec les détails de ta réservation a été envoyé.
                Vérifie tes spams si tu ne le vois pas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/booking" className="flex-1">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nouvelle réservation
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
