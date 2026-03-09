import "dotenv/config";

async function main() {
  const { PrismaClient } = await import("../src/generated/prisma/client.js");
  const prisma = new PrismaClient();
  // Seed services avec prix étudiants bas
  const services = [
    {
      name: "Coupe Simple",
      description: "Coupe classique aux ciseaux ou tondeuse",
      duration: 30,
      price: 1000,
      category: "coiffure",
    },
    {
      name: "Coupe + Barbe",
      description: "Coupe complète avec taille de barbe soignée",
      duration: 45,
      price: 1500,
      category: "coiffure",
    },
    {
      name: "Dégradé",
      description: "Dégradé américain, bas, moyen ou haut",
      duration: 40,
      price: 1500,
      category: "coiffure",
    },
    {
      name: "Dégradé + Design",
      description: "Dégradé avec traits ou motifs personnalisés",
      duration: 50,
      price: 2000,
      category: "coiffure",
    },
    {
      name: "Taille de Barbe",
      description: "Taille et mise en forme de la barbe",
      duration: 20,
      price: 500,
      category: "barbe",
    },
    {
      name: "Coupe Afro",
      description: "Coupe, entretien et mise en forme afro",
      duration: 45,
      price: 1500,
      category: "coiffure",
    },
    {
      name: "Rasage Complet",
      description: "Rasage complet à la lame avec serviette chaude",
      duration: 30,
      price: 1000,
      category: "barbe",
    },
    {
      name: "Coupe Enfant",
      description: "Coupe pour enfant de moins de 12 ans",
      duration: 25,
      price: 800,
      category: "coiffure",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/\s+/g, "-") },
      update: service,
      create: { ...service, id: service.name.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  // Seed time slots pour les 14 prochains jours
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 0; day < 14; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    // Pas de dimanche
    if (date.getDay() === 0) continue;

    const slots =
      date.getDay() === 6
        ? // Samedi: 9h-15h
          [
            { start: "09:00", end: "09:30" },
            { start: "09:30", end: "10:00" },
            { start: "10:00", end: "10:30" },
            { start: "10:30", end: "11:00" },
            { start: "11:00", end: "11:30" },
            { start: "11:30", end: "12:00" },
            { start: "13:00", end: "13:30" },
            { start: "13:30", end: "14:00" },
            { start: "14:00", end: "14:30" },
            { start: "14:30", end: "15:00" },
          ]
        : // Lundi-Vendredi: 9h-18h
          [
            { start: "09:00", end: "09:30" },
            { start: "09:30", end: "10:00" },
            { start: "10:00", end: "10:30" },
            { start: "10:30", end: "11:00" },
            { start: "11:00", end: "11:30" },
            { start: "11:30", end: "12:00" },
            { start: "13:00", end: "13:30" },
            { start: "13:30", end: "14:00" },
            { start: "14:00", end: "14:30" },
            { start: "14:30", end: "15:00" },
            { start: "15:00", end: "15:30" },
            { start: "15:30", end: "16:00" },
            { start: "16:00", end: "16:30" },
            { start: "16:30", end: "17:00" },
            { start: "17:00", end: "17:30" },
            { start: "17:30", end: "18:00" },
          ];

    for (const slot of slots) {
      const id = `${date.toISOString().split("T")[0]}-${slot.start}`;
      await prisma.timeSlot.upsert({
        where: { id },
        update: { date, startTime: slot.start, endTime: slot.end },
        create: {
          id,
          date,
          startTime: slot.start,
          endTime: slot.end,
          isAvailable: true,
        },
      });
    }
  }

  // Créer un admin par défaut
  const bcryptHash = "$2a$10$placeholder"; // À changer en production
  await prisma.adminUser.upsert({
    where: { email: "admin@sesaf-barbershop.com" },
    update: {},
    create: {
      email: "admin@sesaf-barbershop.com",
      password: "admin123", // À changer en production
      name: "SESAF Barber",
    },
  });

  console.log("✅ Base de données seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
