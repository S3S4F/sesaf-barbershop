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
} from "lucide-react";

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const service = searchParams.get("service") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const price = searchParams.get("price") || "0";
  const id = searchParams.get("id") || "";

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
