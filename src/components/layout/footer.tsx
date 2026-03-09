import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="SESAF Barber"
                width={180}
                height={50}
              />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Le barbershop étudiant à Bayonne. Des coupes fraîches à prix
              mini. Au salon ou à domicile.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Résidence Arancette, Bât D, Bayonne 64100</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Sur réservation uniquement</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>contact@sesaf1998@gmail.com.fr</span>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-white font-semibold mb-4">Horaires</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p>Lun - Ven : 9h00 - 18h00</p>
                  <p>Samedi : 9h00 - 15h00</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()}  Barbershop sesaf. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/admin" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
