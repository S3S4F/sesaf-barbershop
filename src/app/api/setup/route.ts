import { NextResponse } from "next/server";
import pg from "pg";

export async function POST() {
  const pool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });

  try {
    // Creer les tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Service" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "duration" INTEGER NOT NULL,
        "price" INTEGER NOT NULL,
        "category" TEXT NOT NULL DEFAULT 'coiffure',
        "imageUrl" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "TimeSlot" (
        "id" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "startTime" TEXT NOT NULL,
        "endTime" TEXT NOT NULL,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "Booking" (
        "id" TEXT NOT NULL,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "serviceId" TEXT NOT NULL,
        "timeSlotId" TEXT NOT NULL,
        "locationType" TEXT NOT NULL DEFAULT 'SALON',
        "address" TEXT,
        "distance" DOUBLE PRECISION,
        "deliveryFee" INTEGER NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
      );

      ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_serviceId_fkey";
      ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey"
        FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

      ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_timeSlotId_fkey";
      ALTER TABLE "Booking" ADD CONSTRAINT "Booking_timeSlotId_fkey"
        FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);

    // Seed services (10€ et 12€ uniquement)
    const services = [
      { id: "coupe-simple", name: "Coupe Simple", description: "Coupe classique au ciseau ou tondeuse, rapide et propre", duration: 30, price: 1000, category: "coiffure" },
      { id: "degrade", name: "Dégradé", description: "Dégradé américain bas, moyen ou haut — le classique campus", duration: 35, price: 1000, category: "coiffure" },
      { id: "degrade-plus-barbe", name: "Dégradé + Barbe", description: "Dégradé complet avec taille et mise en forme de la barbe", duration: 50, price: 1200, category: "coiffure" },
      { id: "degrade-plus-design", name: "Dégradé + Design", description: "Dégradé avec traits ou motifs personnalisés sur mesure", duration: 50, price: 1200, category: "coiffure" },
      { id: "coupe-afro", name: "Coupe Afro", description: "Entretien et mise en forme afro pour cheveux naturels", duration: 40, price: 1200, category: "coiffure" },
      { id: "taille-de-barbe", name: "Taille de Barbe", description: "Taille, contour et mise en forme de la barbe uniquement", duration: 20, price: 1000, category: "barbe" },
      { id: "rasage-complet", name: "Rasage Complet", description: "Rasage intégral à la lame avec serviette chaude", duration: 30, price: 1000, category: "barbe" },
    ];

    for (const s of services) {
      await pool.query(
        `INSERT INTO "Service" ("id", "name", "description", "duration", "price", "category", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         ON CONFLICT ("id") DO UPDATE SET
           "name" = $2, "description" = $3, "duration" = $4, "price" = $5, "category" = $6, "updatedAt" = CURRENT_TIMESTAMP`,
        [s.id, s.name, s.description, s.duration, s.price, s.category]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tables creees et services ajoutes !",
    });
  } catch (error) {
    console.error("Setup error:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await pool.end();
  }
}

export async function GET() {
  return POST();
}
