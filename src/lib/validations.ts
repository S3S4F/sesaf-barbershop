import { z } from "zod";

export const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  customerEmail: z
    .string()
    .email("Veuillez entrer une adresse email valide"),
  customerPhone: z
    .string()
    .min(8, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s-]+$/, "Numéro de téléphone invalide"),
  serviceId: z.string().min(1, "Veuillez choisir un service"),
  timeSlotId: z.string().min(1, "Veuillez choisir un créneau"),
  locationType: z.enum(["SALON", "DOMICILE"]).default("SALON"),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  distance: z.number().optional(),
  deliveryFee: z.number().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => data.locationType === "SALON" || (data.address && data.address.length > 5),
  { message: "Veuillez saisir votre adresse pour une coupe à domicile", path: ["address"] }
);

export type BookingFormData = z.infer<typeof bookingSchema>;
