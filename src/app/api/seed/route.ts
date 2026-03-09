import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Seed services avec prix étudiants en centimes d'euro
    const services = [
      { name: "Coupe Simple", description: "Coupe classique aux ciseaux ou tondeuse", duration: 30, price: 800, category: "coiffure" },
      { name: "Coupe + Barbe", description: "Coupe complète avec taille de barbe soignée", duration: 45, price: 1200, category: "coiffure" },
      { name: "Dégradé", description: "Dégradé américain, bas, moyen ou haut", duration: 40, price: 1200, category: "coiffure" },
      { name: "Dégradé + Design", description: "Dégradé avec traits ou motifs personnalisés", duration: 50, price: 1500, category: "coiffure" },
      { name: "Taille de Barbe", description: "Taille et mise en forme de la barbe", duration: 20, price: 500, category: "barbe" },
      { name: "Coupe Afro", description: "Coupe, entretien et mise en forme afro", duration: 45, price: 1200, category: "coiffure" },
      { name: "Rasage Complet", description: "Rasage complet à la lame avec serviette chaude", duration: 30, price: 800, category: "barbe" },
      { name: "Coupe Enfant", description: "Coupe pour enfant de moins de 12 ans", duration: 25, price: 700, category: "coiffure" },
    ];

    for (const service of services) {
      const id = service.name.toLowerCase().replace(/\s+/g, "-").replace(/\+/g, "plus");
      await prisma.service.upsert({
        where: { id },
        update: service,
        create: { ...service, id },
      });
    }

    return NextResponse.json({ success: true, message: "Services créés ! Définis tes créneaux depuis le dashboard admin." });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Erreur lors du seed" }, { status: 500 });
  }
}
