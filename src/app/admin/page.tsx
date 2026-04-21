"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { ServicesManager } from "@/components/admin/services-manager";
import { GalleryManager } from "@/components/admin/gallery-manager";
import {
  Scissors,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Lock,
  Plus,
  Trash2,
  MapPin,
  Home,
  Image as ImageIcon,
  Images,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  notes: string | null;
  locationType: string;
  address: string | null;
  distance: number | null;
  deliveryFee: number;
  createdAt: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  bookings: { customerName: string; status: string }[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "bookings" | "slots" | "services" | "gallery"
  >("bookings");

  // Slot management state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStart, setNewSlotStart] = useState("10:00");
  const [newSlotEnd, setNewSlotEnd] = useState("11:00");
  const [slotError, setSlotError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState("");

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setAuthError(data.error || "Mot de passe incorrect");
      }
    } catch {
      setAuthError("Erreur de connexion");
    }
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/bookings${params}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchSlots = useCallback(async () => {
    setSlotsLoading(true);
    try {
      const res = await fetch("/api/admin/slots");
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Vérifier si déjà connecté (cookie JWT valide)
  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => { if (res.ok) setIsAuthenticated(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchSlots();
    }
  }, [isAuthenticated, fetchBookings, fetchSlots]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
    } catch {
      // silently fail
    }
  };

  const handleGenerateWeekendSlots = async (monthsAhead: number) => {
    setGenerating(true);
    setGenerateMsg("");
    try {
      const res = await fetch("/api/admin/generate-weekend-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthsAhead }),
      });
      const data = await res.json();
      if (!res.ok) { setGenerateMsg(data.error || "Erreur"); return; }
      setGenerateMsg(data.message);
      fetchSlots();
    } catch {
      setGenerateMsg("Erreur de connexion");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddSlot = async () => {
    if (!newSlotDate || !newSlotStart || !newSlotEnd) {
      setSlotError("Remplis tous les champs");
      return;
    }
    setSlotError("");
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newSlotDate,
          startTime: newSlotStart,
          endTime: newSlotEnd,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSlotError(data.error || "Erreur");
        return;
      }
      setNewSlotStart("09:00");
      setNewSlotEnd("09:30");
      fetchSlots();
    } catch {
      setSlotError("Erreur de connexion");
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const res = await fetch(`/api/admin/slots?id=${slotId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setSlotError(data.error || "Impossible de supprimer");
        return;
      }
      fetchSlots();
    } catch {
      setSlotError("Erreur de connexion");
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmé</Badge>;
      case "COMPLETED":
        return <Badge>Terminé</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
            <CardTitle>Admin Dashboard</CardTitle>
            <p className="text-zinc-500 text-sm mt-1">
              Connecte-toi pour gérer ton salon
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {authError && (
                <p className="text-red-400 text-xs">{authError}</p>
              )}
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const totalRevenue = completedBookings.reduce(
    (sum, b) => sum + b.service.price + (b.deliveryFee || 0),
    0
  );
  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.timeSlot.date);
    const today = new Date();
    return (
      bookingDate.toDateString() === today.toDateString() &&
      b.status !== "CANCELLED"
    );
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-zinc-500 text-sm">
              Gère tes réservations et tes créneaux
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              setIsAuthenticated(false);
            }}
          >
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {todayBookings.length}
                  </p>
                  <p className="text-xs text-zinc-500">Aujourd&apos;hui</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {confirmedBookings.length}
                  </p>
                  <p className="text-xs text-zinc-500">Confirmées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {bookings.length}
                  </p>
                  <p className="text-xs text-zinc-500">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(totalRevenue)}
                  </p>
                  <p className="text-xs text-zinc-500">Gagné</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            <Scissors className="w-4 h-4 inline mr-2" />
            Réservations
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "slots"
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Mes créneaux
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "services"
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Images services
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "gallery"
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            <Images className="w-4 h-4 inline mr-2" />
            Galerie
          </button>
        </div>

        {/* === BOOKINGS TAB === */}
        {activeTab === "bookings" && (
          <>
            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { value: "all", label: "Toutes" },
                { value: "CONFIRMED", label: "Confirmées" },
                { value: "COMPLETED", label: "Terminées" },
                { value: "CANCELLED", label: "Annulées" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === tab.value
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-amber-500" />
                  Réservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded-xl bg-zinc-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500">Aucune réservation trouvée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-800/50 rounded-xl gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-600/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-amber-400 font-bold text-sm">
                              {booking.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {booking.customerName}
                            </p>
                            <p className="text-zinc-500 text-xs">
                              {booking.customerPhone}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Scissors className="w-3.5 h-3.5 text-amber-500" />
                            <span>{booking.service.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>
                              {format(new Date(booking.timeSlot.date), "EEE dd MMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{booking.timeSlot.startTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {booking.locationType === "DOMICILE" ? (
                              <Home className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            <span>
                              {booking.locationType === "DOMICILE"
                                ? "Domicile"
                                : "Salon"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {statusBadge(booking.status)}
                          <span className="text-amber-400 font-semibold text-sm">
                            {formatPrice(booking.service.price + (booking.deliveryFee || 0))}
                          </span>

                          {booking.status === "CONFIRMED" && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "COMPLETED")
                                }
                                className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 transition-colors"
                                title="Marquer terminé"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "CANCELLED")
                                }
                                className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors"
                                title="Annuler"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* === SLOTS TAB === */}
        {activeTab === "slots" && (
          <div className="space-y-6">
            {/* Génération weekends en masse */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  Générer créneaux weekends (10h – 22h, toutes les 1h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "1 mois", monthsAhead: 1 },
                    { label: "3 mois", monthsAhead: 3 },
                    { label: "6 mois", monthsAhead: 6 },
                    { label: "12 mois", monthsAhead: 12 },
                  ].map((opt) => (
                    <Button
                      key={opt.label}
                      onClick={() => handleGenerateWeekendSlots(opt.monthsAhead)}
                      disabled={generating}
                      variant="outline"
                      className="text-sm"
                    >
                      {generating ? "Génération..." : opt.label}
                    </Button>
                  ))}
                </div>
                {generateMsg && (
                  <p className="text-emerald-400 text-xs mt-3">{generateMsg}</p>
                )}
              </CardContent>
            </Card>

            {/* Add slot form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plus className="w-5 h-5 text-amber-500" />
                  Ajouter un créneau
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={newSlotDate}
                      onChange={(e) => setNewSlotDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Début</label>
                    <Input
                      type="time"
                      value={newSlotStart}
                      onChange={(e) => setNewSlotStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Fin</label>
                    <Input
                      type="time"
                      value={newSlotEnd}
                      onChange={(e) => setNewSlotEnd(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddSlot} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
                {slotError && (
                  <p className="text-red-400 text-xs mt-2">{slotError}</p>
                )}
              </CardContent>
            </Card>

            {/* Slots list */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Mes créneaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slotsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 rounded-xl bg-zinc-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500">Aucun créneau défini</p>
                    <p className="text-zinc-600 text-xs mt-1">
                      Ajoute des créneaux pour que les clients puissent réserver
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-white font-medium">
                              {format(new Date(slot.date), "EEE dd MMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {slot.bookings && slot.bookings.length > 0 ? (
                            <Badge variant="success" className="text-xs">
                              {slot.bookings[0].customerName}
                            </Badge>
                          ) : (
                            <Badge className="text-xs bg-zinc-700 text-zinc-400">
                              Libre
                            </Badge>
                          )}
                          {(!slot.bookings || slot.bookings.length === 0) && (
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* === SERVICES TAB === */}
        {activeTab === "services" && <ServicesManager />}

        {/* === GALLERY TAB === */}
        {activeTab === "gallery" && <GalleryManager />}
      </div>
    </div>
  );
}
