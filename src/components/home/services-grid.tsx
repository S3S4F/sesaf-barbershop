"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export type Service = {
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {services.map((service) => (
        <motion.div
          key={service.name}
          variants={item}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Link href="/booking" className="group block h-full">
            <div className="relative h-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors duration-300">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm border border-amber-500/30 rounded-full px-3 py-1.5">
                  <span className="text-amber-400 font-bold text-sm">
                    {(service.price / 100).toFixed(0)}€
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1">
                    {service.name}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 mb-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration} min
                    </span>
                    <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                      Réserver →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
