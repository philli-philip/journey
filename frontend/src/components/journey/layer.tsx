import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layer({
  title = "Title",
  data,
  renderItem = (item: string) => item,
  hideToggle = false,
  className,
  onUpdateItem,
}: {
  title: string;
  data: string[];
  renderItem?: (item: string) => React.ReactNode;
  hideToggle?: boolean;
  className?: string;
  onUpdateItem?: (index: number, newItem: string) => void;
}) {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <div
      className={cn(
        "w-full flex flex-row flex-1 gap-1 border-gray-100",
        className
      )}
    >
      <div className="p-2 w-48 flex flex-row justify-between border-b items-start">
        <h2 className="text-foreground capitalize text-sm pl-2 pt-0.5">
          {title}
        </h2>
        {!hideToggle && (
          <Button
            onClick={() => setOpen(!open)}
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
          >
            {open ? <ChevronUp size="12" /> : <ChevronDown size="12" />}
          </Button>
        )}
      </div>

      {data.map((item, index) => {
        if (open) {
          return (
            <div
              key={index}
              className={cn("p-2 flex-1 min-w-48 border-b bg-card", className)}
            >
              {onUpdateItem ? (
                <textarea
                  className="w-full h-full bg-card resize-none focus:outline-none"
                  value={item}
                  onChange={(e) => onUpdateItem(index, e.target.value)}
                />
              ) : (
                renderItem(item)
              )}
            </div>
          );
        } else {
          return (
            <div key={index} className="p-2 flex-1 border-b min-w-48 bg-card" />
          );
        }
      })}
    </div>
  );
}
