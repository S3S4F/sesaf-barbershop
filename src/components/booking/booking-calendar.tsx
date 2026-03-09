"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface BookingCalendarProps {
  selectedDate: Date | null;
  selectedSlot: string | null;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slotId: string) => void;
}

export function BookingCalendar({
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
}: BookingCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchSlots = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(`/api/timeslots?date=${dateStr}`);
      const data = await res.json();
      setSlots(data);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  const handlePrevWeek = () => {
    const newStart = addDays(weekStart, -7);
    if (!isBefore(newStart, startOfDay(new Date()))) {
      setWeekStart(newStart);
    }
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Choisis une date</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isPast = isBefore(day, startOfDay(new Date()));
            const isSunday = day.getDay() === 0;
            const isDisabled = isPast || isSunday;
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isDisabled && onDateSelect(day)}
                disabled={isDisabled}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl transition-all duration-200",
                  isDisabled
                    ? "opacity-30 cursor-not-allowed"
                    : "cursor-pointer hover:bg-zinc-800",
                  isSelected
                    ? "bg-amber-600 text-white hover:bg-amber-500"
                    : "text-zinc-400",
                  isToday(day) && !isSelected && "ring-1 ring-amber-600/50"
                )}
              >
                <span className="text-[10px] uppercase font-medium">
                  {format(day, "EEE", { locale: fr })}
                </span>
                <span className="text-lg font-bold mt-1">
                  {format(day, "d")}
                </span>
                <span className="text-[10px] mt-0.5">
                  {format(day, "MMM", { locale: fr })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Créneaux disponibles
          </h3>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 rounded-xl bg-zinc-800 animate-pulse"
                />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">
              Aucun créneau disponible ce jour. Essaie un autre jour !
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.isAvailable && onSlotSelect(slot.id)}
                  disabled={!slot.isAvailable}
                  className={cn(
                    "h-11 rounded-xl text-sm font-medium transition-all duration-200",
                    !slot.isAvailable
                      ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed line-through"
                      : selectedSlot === slot.id
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-900/30"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                  )}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
