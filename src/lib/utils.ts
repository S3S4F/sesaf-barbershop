import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number): string {
  return `${(priceInCents / 100).toFixed(2).replace(".", ",")}€`;
}

const ARANCETTE_LAT = 43.4833;
const ARANCETTE_LNG = -1.4833;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number = ARANCETTE_LAT,
  lng2: number = ARANCETTE_LNG
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateDeliveryFee(distanceKm: number): number {
  return Math.round(distanceKm * 35);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTime(time: string): string {
  return time;
}
