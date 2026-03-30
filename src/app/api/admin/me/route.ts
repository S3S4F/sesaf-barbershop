import { verifyAdminToken } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if (!auth.valid) return auth.error!;
  return NextResponse.json({ authenticated: true });
}
