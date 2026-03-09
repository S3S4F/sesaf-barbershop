import { describe, it, expect } from "vitest";
import { bookingSchema } from "@/lib/validations";

describe("bookingSchema", () => {
  it("validates a correct booking", () => {
    const result = bookingSchema.safeParse({
      customerName: "Moussa Diallo",
      customerEmail: "moussa@campus.sn",
      customerPhone: "+221771234567",
      serviceId: "coupe-simple",
      timeSlotId: "2024-01-15-09:00",
      notes: "Dégradé bas svp",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = bookingSchema.safeParse({
      customerName: "",
      customerEmail: "moussa@campus.sn",
      customerPhone: "+221771234567",
      serviceId: "coupe-simple",
      timeSlotId: "slot-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = bookingSchema.safeParse({
      customerName: "Moussa",
      customerEmail: "notanemail",
      customerPhone: "+221771234567",
      serviceId: "coupe-simple",
      timeSlotId: "slot-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone", () => {
    const result = bookingSchema.safeParse({
      customerName: "Moussa",
      customerEmail: "moussa@campus.sn",
      customerPhone: "abc",
      serviceId: "coupe-simple",
      timeSlotId: "slot-1",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional notes", () => {
    const result = bookingSchema.safeParse({
      customerName: "Moussa Diallo",
      customerEmail: "moussa@campus.sn",
      customerPhone: "+221771234567",
      serviceId: "coupe-simple",
      timeSlotId: "slot-1",
    });
    expect(result.success).toBe(true);
  });
});
