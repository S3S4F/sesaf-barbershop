"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/services/service-card";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingForm } from "@/components/booking/booking-form";
import { LocationPicker } from "@/components/booking/location-picker";
import { bookingSchema } from "@/lib/validations";
import { formatPrice } from "@/lib/utils";
import {
  Scissors,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

const steps = [
  { id: 1, label: "Service", icon: Scissors },
  { id: 2, label: "Lieu", icon: MapPin },
  { id: 3, label: "Date & Heure", icon: Calendar },
  { id: 4, label: "Infos", icon: User },
];

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Location state
  const [locationType, setLocationType] = useState<"SALON" | "DOMICILE">("SALON");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    setCurrentStep(2);
  };

  const handleLocationTypeChange = (type: "SALON" | "DOMICILE") => {
    setLocationType(type);
    if (type === "SALON") {
      setAddress("");
      setLatitude(null);
      setLongitude(null);
      setDistance(null);
      setDeliveryFee(null);
    }
  };

  const handleLocationConfirm = (data: {
    address: string;
    latitude: number;
    longitude: number;
    distance: number;
    deliveryFee: number;
  }) => {
    setAddress(data.address);
    setLatitude(data.latitude);
    setLongitude(data.longitude);
    setDistance(data.distance);
    setDeliveryFee(data.deliveryFee);
  };

  const handleGoToDateStep = () => {
    if (locationType === "DOMICILE" && !address) {
      return; // Need address for domicile
    }
    setCurrentStep(3);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setCurrentStep(4);
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "customerName":
        setCustomerName(value);
        break;
      case "customerEmail":
        setCustomerEmail(value);
        break;
      case "customerPhone":
        setCustomerPhone(value);
        break;
      case "notes":
        setNotes(value);
        break;
    }
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const data = {
      customerName,
      customerEmail,
      customerPhone,
      serviceId: selectedService || "",
      timeSlotId: selectedSlot || "",
      notes,
      locationType,
      address: locationType === "DOMICILE" ? address : undefined,
      latitude: locationType === "DOMICILE" ? latitude : undefined,
      longitude: locationType === "DOMICILE" ? longitude : undefined,
      distance: locationType === "DOMICILE" ? distance : undefined,
      deliveryFee: locationType === "DOMICILE" ? (deliveryFee ?? 0) : 0,
    };

    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.error || "Une erreur est survenue" });
        }
        return;
      }

      const params = new URLSearchParams({
        name: result.booking.customerName,
        service: result.booking.service,
        date: result.booking.date,
        time: result.booking.time,
        price: result.booking.price.toString(),
        id: result.booking.id,
      });
      router.push(`/booking/confirmation?${params.toString()}`);
    } catch {
      setErrors({ general: "Erreur de connexion. Réessaie." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);
  const servicePrice = selectedServiceData?.price ?? 0;
  const totalDeliveryFee = locationType === "DOMICILE" ? (deliveryFee ?? 0) : 0;
  const totalPrice = servicePrice + totalDeliveryFee;

  return (
    <div className="min-h-screen py-8 pb-32 lg:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-2 mb-4">
            <Scissors className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Réservation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Réserve ton <span className="text-amber-400">créneau</span>
          </h1>
          <p className="text-zinc-400 mt-2">
            Choisis ton service, ton lieu, ta date et ton heure. C&apos;est rapide !
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  step.id === currentStep
                    ? "bg-amber-600 text-white"
                    : step.id < currentStep
                    ? "bg-amber-600/20 text-amber-400 cursor-pointer hover:bg-amber-600/30"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <step.icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-zinc-600" />
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-xl text-red-400 text-sm text-center">
            {errors.general}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Choose service */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-white font-semibold text-lg mb-4">
                  Choisis ta prestation
                </h2>
                {services.length === 0 ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 rounded-2xl bg-zinc-800 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        {...service}
                        selected={selectedService === service.id}
                        onSelect={handleServiceSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <Card>
                <CardContent className="p-6">
                  <LocationPicker
                    locationType={locationType}
                    onLocationTypeChange={handleLocationTypeChange}
                    address={address}
                    onAddressChange={setAddress}
                    onLocationConfirm={handleLocationConfirm}
                    distance={distance}
                    deliveryFee={deliveryFee}
                  />
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors text-sm font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Retour
                    </button>
                    <button
                      onClick={handleGoToDateStep}
                      disabled={locationType === "DOMICILE" && !address}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Continuer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Choisis ta date et ton heure</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onDateSelect={handleDateSelect}
                    onSlotSelect={handleSlotSelect}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Customer info */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tes informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingForm
                    customerName={customerName}
                    customerEmail={customerEmail}
                    customerPhone={customerPhone}
                    notes={notes}
                    onChange={handleFieldChange}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    errors={errors}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary - sidebar on desktop, bottom sheet on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedServiceData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium text-sm">
                          {selectedServiceData.name}
                        </p>
                        <p className="text-zinc-500 text-xs">
                          {selectedServiceData.duration} min
                        </p>
                      </div>
                      <Badge>{selectedServiceData.category}</Badge>
                    </div>

                    {/* Location */}
                    <div className="pt-3 border-t border-zinc-800">
                      <p className="text-zinc-500 text-xs mb-1">Lieu</p>
                      <p className="text-white text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {locationType === "SALON" ? "Au salon (Arancette)" : "À domicile"}
                      </p>
                      {locationType === "DOMICILE" && address && (
                        <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{address}</p>
                      )}
                    </div>

                    {selectedDate && (
                      <div className="pt-3 border-t border-zinc-800">
                        <p className="text-zinc-500 text-xs mb-1">Date</p>
                        <p className="text-white text-sm font-medium">
                          {selectedDate.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    )}

                    {selectedSlot && (
                      <div className="pt-3 border-t border-zinc-800">
                        <p className="text-zinc-500 text-xs mb-1">Heure</p>
                        <p className="text-white text-sm font-medium">
                          {selectedSlot.split("-").pop()}
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-zinc-800 space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Service</span>
                        <span className="text-zinc-300">{formatPrice(servicePrice)}</span>
                      </div>
                      {totalDeliveryFee > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500">Déplacement ({distance} km)</span>
                          <span className="text-zinc-300">+{formatPrice(totalDeliveryFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                        <span className="text-zinc-400 font-medium">Total</span>
                        <span className="text-xl font-bold text-amber-400">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm text-center py-4">
                    Sélectionne un service pour commencer
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet recap */}
      {selectedServiceData && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-4 z-50">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div>
              <p className="text-white font-medium text-sm">{selectedServiceData.name}</p>
              <p className="text-zinc-500 text-xs">
                {locationType === "SALON" ? "Au salon" : "À domicile"}
                {totalDeliveryFee > 0 && ` · +${formatPrice(totalDeliveryFee)}`}
              </p>
            </div>
            <span className="text-xl font-bold text-amber-400">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
