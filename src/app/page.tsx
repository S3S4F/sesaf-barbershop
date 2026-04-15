import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scissors,
  Clock,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Zap,
} from "lucide-react";

const services = [
  {
    name: "Coupe Simple",
    description: "Coupe classique au ciseau ou tondeuse, rapide et propre",
    duration: 30,
    price: 1000,
    icon: Scissors,
  },
  {
    name: "Dégradé",
    description: "Dégradé américain bas, moyen ou haut — le classique campus",
    duration: 35,
    price: 1000,
    icon: Zap,
  },
  {
    name: "Dégradé + Barbe",
    description: "Dégradé complet avec taille et mise en forme de la barbe",
    duration: 50,
    price: 1200,
    icon: Star,
  },
  {
    name: "Dégradé + Design",
    description: "Dégradé avec traits ou motifs personnalisés sur mesure",
    duration: 50,
    price: 1200,
    icon: Sparkles,
  },
  {
    name: "Coupe Afro",
    description: "Entretien et mise en forme afro pour cheveux naturels",
    duration: 40,
    price: 1200,
    icon: Zap,
  },
  {
    name: "Taille de Barbe",
    description: "Taille, contour et mise en forme de la barbe uniquement",
    duration: 20,
    price: 1000,
    icon: Scissors,
  },
];

const stats = [
  { label: "Étudiants satisfaits", value: "500+", icon: Users },
  { label: "Coupes réalisées", value: "2000+", icon: Scissors },
  { label: "Note moyenne", value: "4.9/5", icon: Star },
  { label: "Min de réservation", value: "2", icon: Clock },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">
                  Prix spéciaux étudiants
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Ton style,{" "}
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  ta coupe,
                </span>
                <br />
                à Bayonne.
              </h1>

              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                Le barbershop étudiant à Bayonne, Résidence Arancette. Des
                coupes fraîches, au salon ou à domicile, à des prix imbattables.
                Réserve ton créneau en 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button size="lg" className="text-base px-8">
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver maintenant
                  </Button>
                </Link>
                <Link href="#tarifs">
                  <Button variant="outline" size="lg" className="text-base px-8">
                    Voir les tarifs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-amber-400">500+</p>
                  <p className="text-xs text-zinc-500">Étudiants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">4.9</p>
                  <p className="text-xs text-zinc-500">★ Note</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">10€</p>
                  <p className="text-xs text-zinc-500">Dès</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-[420px] h-[420px] rounded-full flex items-center justify-center animate-float overflow-hidden">
                  <Image
                    src="/bar.jpeg"
                    alt="Bar en action"
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
                      <p className="text-sm font-semibold text-white">Disponible !</p>
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
                      <p className="text-sm font-semibold text-white">Arancette, Bât D</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge>Nos Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              Des prestations <span className="text-amber-400">professionnelles</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
              Chaque coupe est réalisée avec soin par notre barbier expérimenté. Qualité salon, prix campus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card key={service.name} className="group hover:border-amber-600/30 transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-600/20 transition-colors">
                    <service.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{service.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-400">
                      {(service.price / 100).toFixed(0)}€
                      <span className="text-xs text-zinc-500 ml-1"></span>
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="success">Tarifs Étudiants</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
              Des prix pensés pour <span className="text-amber-400">ton budget</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
              Pas besoin de casser ta tirelire pour être frais. Nos tarifs sont conçus pour les étudiants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Essentiel</h3>
                <p className="text-zinc-500 text-sm mb-6">Coupe simple, barbe ou rasage</p>
                <p className="text-4xl font-bold text-white mb-1">10€</p>
                <p className="text-zinc-500 text-sm mb-6"></p>
                <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                  <li className="flex items-center gap-2"><Scissors className="w-4 h-4 text-amber-500" />Coupe simple / Dégradé</li>
                  <li className="flex items-center gap-2"><Scissors className="w-4 h-4 text-amber-500" />Taille de barbe / Rasage</li>
                  <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" />20-35 minutes</li>
                </ul>
                <Link href="/booking"><Button variant="outline" className="w-full">Réserver</Button></Link>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-amber-600/50 scale-105">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
              <CardContent className="p-8 text-center">
                <Badge className="mb-4">Le + populaire</Badge>
                <h3 className="text-lg font-semibold text-white mb-2">Premium</h3>
                <p className="text-zinc-500 text-sm mb-6">Dégradé + barbe ou coupe afro</p>
                <p className="text-4xl font-bold text-amber-400 mb-1">12€</p>
                <p className="text-zinc-500 text-sm mb-6"></p>
                <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" />Dégradé + mise en forme barbe</li>
                  <li className="flex items-center gap-2"><Scissors className="w-4 h-4 text-amber-500" />Coupe Afro naturelle</li>
                  <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" />40-50 minutes</li>
                </ul>
                <Link href="/booking"><Button className="w-full">Réserver</Button></Link>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Exclusive</h3>
                <p className="text-zinc-500 text-sm mb-6">Dégradé avec design personnalisé</p>
                <p className="text-4xl font-bold text-white mb-1">12€</p>
                <p className="text-zinc-500 text-sm mb-6"></p>
                <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                  <li className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" />Design sur mesure</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" />Traits / motifs au choix</li>
                  <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" />50 minutes</li>
                </ul>
                <Link href="/booking"><Button variant="outline" className="w-full">Réserver</Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge>À propos</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
                Le barbershop <span className="text-amber-400">étudiant à Bayonne</span>
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>SESAF Barbershop est né d&apos;une idée simple : offrir aux étudiants de Bayonne un service de coiffure professionnel à des prix accessibles, directement à la Résidence Arancette.</p>
                <p>Notre barbier maîtrise toutes les techniques modernes — dégradés, designs, coupes afro, taille de barbe — et se déplace aussi à domicile (+0,35€/km).</p>
                <p>Réserve en ligne, choisis salon ou domicile, et profite d&apos;une coupe fraîche. C&apos;est aussi simple que ça.</p>
              </div>
              <div className="mt-8">
                <Link href="/booking"><Button size="lg"><Calendar className="w-5 h-5 mr-2" />Réserver un créneau</Button></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Scissors className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">Pro</h3>
                <p className="text-zinc-500 text-xs">Barbier qualifié et expérimenté</p>
              </Card>
              <Card className="p-6 text-center">
                <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">Bayonne</h3>
                <p className="text-zinc-500 text-xs">Arancette, Bât D</p>
              </Card>
              <Card className="p-6 text-center">
                <Clock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">Rapide</h3>
                <p className="text-zinc-500 text-xs">Réserve en 2 minutes</p>
              </Card>
              <Card className="p-6 text-center">
                <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">Abordable</h3>
                <p className="text-zinc-500 text-xs">Prix spéciaux étudiants</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-amber-800/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à être <span className="text-amber-400">frais</span> ?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Réserve ton créneau maintenant. Au salon à Arancette ou à domicile, au meilleur prix de Bayonne.
          </p>
          <Link href="/booking">
            <Button size="lg" className="text-base px-10">
              <Calendar className="w-5 h-5 mr-2" />
              Réserver mon créneau
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
