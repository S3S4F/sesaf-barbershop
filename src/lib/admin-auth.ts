import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sesaf_jwt_secret_2024_do_not_expose"
);

export async function verifyAdminToken(
  request: NextRequest
): Promise<{ valid: boolean; error?: NextResponse }> {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return {
      valid: false,
      error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      ),
    };
  }
}
