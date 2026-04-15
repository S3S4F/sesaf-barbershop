import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServicesGrid, type Service } from "@/components/home/services-grid";
import { FadeIn } from "@/components/home/fade-in";
import {
  Scissors,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Calendar,
  Zap,
  Euro,
  Home,
  CalendarCheck,
} from "lucide-react";

const services: Service[] = [
  {
    name: "Coupe Simple",
    description: "Coupe classique au ciseau ou tondeuse, rapide et propre",
    duration: 30,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1521322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Taper",
    description: "Taper fade précis, transitions nettes sur les côtés",
    duration: 30,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dégradé",
    description: "Dégradé américain bas, moyen ou haut — le classique campus",
    duration: 35,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dégradé + Barbe",
    description: "Dégradé complet avec taille et mise en forme de la barbe",
    duration: 50,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dégradé + Design",
    description: "Dégradé avec traits ou motifs personnalisés sur mesure",
    duration: 50,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1635273051839-003bf06a8751?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Coupe Afro",
    description: "Entretien et mise en forme afro pour cheveux naturels",
    duration: 40,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Taille de Barbe",
    description: "Taille, contour et mise en forme de la barbe uniquement",
    duration: 20,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rasage Complet",
    description: "Rasage intégral à la lame avec serviette chaude",
    duration: 30,
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
  },
];

const highlights = [
  { label: "Tarif de base", value: "10€", icon: Euro },
  { label: "Service salon", value: "Arancette", icon: MapPin },
  { label: "À domicile", value: "+0.35€/km", icon: Home },
  { label: "Weekends", value: "10h–22h", icon: CalendarCheck },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">
                  Tarifs étudiants — 10€ &amp; 12€
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
                Ton style,{" "}
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  ta coupe,
                </span>
                <br />à Bayonne.
              </h1>

              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                Barbershop étudiant à la Résidence Arancette. Coupes fraîches,
                au salon ou à domicile, tarifs accessibles. Réserve en 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button size="lg" className="text-base px-8 w-full sm:w-auto">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver maintenant
                  </Button>
                </Link>
                <Link href="#services">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 w-full sm:w-auto"
                  >
                    Voir les prestations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <div>
                  <p className="text-2xl font-bold text-amber-400">10€</p>
                  <p className="text-xs text-zinc-500">Dès</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">12€</p>
                  <p className="text-xs text-zinc-500">Premium</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">2 min</p>
                  <p className="text-xs text-zinc-500">Réservation</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-[420px] h-[420px] rounded-full flex items-center justify-center animate-float overflow-hidden">
                  <Image
                    src="/bar.jpeg"
                    alt="Barber en action"
                    width={420}
                    height={420}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="absolute top-4 right-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Prochain créneau</p>
                      <p className="text-sm font-semibold text-white">
                        Disponible !
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Localisation</p>
                      <p className="text-sm font-semibold text-white">
                        Arancette, Bât D
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Highlights (remplace les stats bidons) */}
      <section className="py-16 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {highlights.map((h) => (
                <div key={h.label} className="text-center">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <h.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {h.value}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">{h.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <Badge>Nos Prestations</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
              Des prestations{" "}
              <span className="text-amber-400">professionnelles</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
              Chaque coupe est réalisée avec soin. Qualité salon, prix campus.
            </p>
          </FadeIn>

          <ServicesGrid services={services} />
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <Badge variant="success">Tarifs Étudiants</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              Des prix pensés pour{" "}
              <span className="text-amber-400">ton budget</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
              Deux tarifs simples, c&apos;est tout.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <Card className="relative overflow-hidden h-full">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Essentiel
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6">
                    Coupe, dégradé, taper, barbe ou rasage
                  </p>
                  <p className="text-5xl font-bold text-white mb-6">10€</p>
                  <ul className="space-y-3 text-sm text-zinc-400 mb-8 text-left max-w-xs mx-auto">
                    <li className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-amber-500 shrink-0" />
                      Coupe simple / Dégradé / Taper
                    </li>
                    <li className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-amber-500 shrink-0" />
                      Taille de barbe / Rasage complet
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      20–35 minutes
                    </li>
                  </ul>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full">
                      Réserver
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="relative overflow-hidden border-amber-600/50 h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
                <CardContent className="p-8 text-center">
                  <Badge className="mb-4">Le + populaire</Badge>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Premium
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6">
                    Dégradé + barbe, coupe afro ou design
                  </p>
                  <p className="text-5xl font-bold text-amber-400 mb-6">12€</p>
                  <ul className="space-y-3 text-sm text-zinc-400 mb-8 text-left max-w-xs mx-auto">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      Dégradé + mise en forme barbe
                    </li>
                    <li className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-amber-500 shrink-0" />
                      Coupe Afro / Design sur mesure
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      40–50 minutes
                    </li>
                  </ul>
                  <Link href="/booking">
                    <Button className="w-full">Réserver</Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <Badge>À propos</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
                Le barbershop{" "}
                <span className="text-amber-400">étudiant à Bayonne</span>
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  SESAF Barbershop est né d&apos;une idée simple : offrir aux
                  étudiants de Bayonne un service de coiffure à des prix
                  accessibles, directement à la Résidence Arancette.
                </p>
                <p>
                  Dégradés, tapers, designs, coupes afro, taille de barbe — je
                  me déplace aussi à domicile (+0,35€/km).
                </p>
                <p>
                  Réserve en ligne, choisis salon ou domicile, et profite
                  d&apos;une coupe fraîche.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/booking">
                  <Button size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver un créneau
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center">
                  <Scissors className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Pro</h3>
                  <p className="text-zinc-500 text-xs">
                    Barbier qualifié
                  </p>
                </Card>
                <Card className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Bayonne</h3>
                  <p className="text-zinc-500 text-xs">Arancette, Bât D</p>
                </Card>
                <Card className="p-6 text-center">
                  <Clock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Rapide</h3>
                  <p className="text-zinc-500 text-xs">Réservation 2 min</p>
                </Card>
                <Card className="p-6 text-center">
                  <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Abordable</h3>
                  <p className="text-zinc-500 text-xs">10€ / 12€</p>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-amber-800/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <FadeIn className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Prêt à être <span className="text-amber-400">frais</span> ?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Réserve ton créneau maintenant. Au salon à Arancette ou à domicile,
            au meilleur prix de Bayonne.
          </p>
          <Link href="/booking">
            <Button size="lg" className="text-base px-10">
              <Calendar className="w-5 h-5 mr-2" />
              Réserver mon créneau
            </Button>
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
