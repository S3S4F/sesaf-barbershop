import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-amber-600/20 text-amber-400 border-amber-600/30",
    success: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
    warning: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    danger: "bg-red-600/20 text-red-400 border-red-600/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
