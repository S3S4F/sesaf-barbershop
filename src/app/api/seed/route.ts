import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Seed services avec prix entre 10€ et 15€ (en centimes)
    const services = [
      { name: "Coupe Simple", description: "Coupe classique au ciseau ou tondeuse, rapide et propre", duration: 30, price: 1000, category: "coiffure" },
      { name: "Dégradé", description: "Dégradé américain bas, moyen ou haut — le classique campus", duration: 35, price: 1000, category: "coiffure" },
      { name: "Dégradé + Barbe", description: "Dégradé complet avec taille et mise en forme de la barbe", duration: 50, price: 1200, category: "coiffure" },
      { name: "Dégradé + Design", description: "Dégradé avec traits ou motifs personnalisés sur mesure", duration: 50, price: 1200, category: "coiffure" },
      { name: "Coupe Afro", description: "Entretien et mise en forme afro pour cheveux naturels", duration: 40, price: 1200, category: "coiffure" },
      { name: "Taille de Barbe", description: "Taille, contour et mise en forme de la barbe uniquement", duration: 20, price: 1000, category: "barbe" },
      { name: "Rasage Complet", description: "Rasage intégral à la lame avec serviette chaude", duration: 30, price: 1000, category: "barbe" },
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
