import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Tag } from "lucide-react";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function ServiceCard({
  id,
  name,
  description,
  duration,
  price,
  category,
  selected,
  onSelect,
}: ServiceCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-amber-600/50 ${
        selected
          ? "border-amber-500 bg-amber-950/20 ring-2 ring-amber-500/30"
          : "hover:bg-zinc-800/50"
      }`}
      onClick={() => onSelect?.(id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-amber-400">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span className="capitalize">{category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
