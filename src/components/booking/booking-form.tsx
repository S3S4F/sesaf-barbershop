"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";

interface BookingFormProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export function BookingForm({
  customerName,
  customerEmail,
  customerPhone,
  notes,
  onChange,
  onSubmit,
  isSubmitting,
  errors,
}: BookingFormProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <User className="w-4 h-4 text-amber-500" />
        Tes coordonnées
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Nom complet *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Jean Dupont"
              value={customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.customerName && (
            <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="email"
              placeholder="jean@univ-pau.fr"
              value={customerEmail}
              onChange={(e) => onChange("customerEmail", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.customerEmail && (
            <p className="text-red-400 text-xs mt-1">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Téléphone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={customerPhone}
              onChange={(e) => onChange("customerPhone", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.customerPhone && (
            <p className="text-red-400 text-xs mt-1">{errors.customerPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Notes (optionnel)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <Textarea
              placeholder="Ex: Je voudrais un dégradé bas..."
              value={notes}
              onChange={(e) => onChange("notes", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Réservation en cours...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmer la réservation
          </>
        )}
      </Button>
    </div>
  );
}
