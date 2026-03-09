import { describe, it, expect } from "vitest";
import { cn, formatPrice } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names", () => {
    const result = cn("text-white", "bg-black");
    expect(result).toBe("text-white bg-black");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toBe("base visible");
  });
});

describe("formatPrice", () => {
  it("formats price with locale", () => {
    const result = formatPrice(1500);
    expect(result).toContain("FCFA");
    expect(result).toContain("1");
  });
});
