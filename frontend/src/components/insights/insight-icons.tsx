import { cn } from "@/lib/utils";
import type { InsightTypes } from "@shared/types";
import {
  Annoyed,
  Goal,
  Lightbulb,
  Smile,
  type LucideProps,
} from "lucide-react";

export function InsightIcon({
  type,
  className,
  ...props
}: { type: InsightTypes } & LucideProps) {
  switch (type) {
    case "gain":
      return <Smile className={cn("text-green-600", className)} {...props} />;
    case "observation":
      return (
        <Lightbulb className={cn("text-amber-600", className)} {...props} />
      );
    case "need":
      return <Goal className={cn("text-sky-600", className)} {...props} />;
    case "pain":
      return <Annoyed className={cn("text-rose-600", className)} {...props} />;
  }
}
