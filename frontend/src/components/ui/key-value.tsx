import { cn } from "@/lib/utils";
import { Button } from "./button";
import { type SyntheticEvent } from "react";

export function KeyValue({
  label,
  value,
  className,
  permanent = false,
  muted = false,
}: {
  label: string | JSX.Element;
  value?: string | JSX.Element;
  className?: string;
  muted?: boolean;
  permanent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex px-4 flex-row min-h-8 text-sm",
        className,
        !permanent &&
          "group-data-[open=true]:flex group-data-[open=false]:hidden"
      )}
    >
      <span className="text-muted-foreground w-(--label-width) pt-2">
        {label}
      </span>
      <span
        className={cn(
          "text-neutral-900 pt-2",
          muted && "text-muted-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function KeyValueDivider() {
  return <div className="w-full h-px my-2 bg-neutral-200" />;
}

export function KeyValueList({
  children,
  width = 120,
  className,
  open = true,
}: {
  children?: React.ReactNode[] | React.ReactNode;
  width?: number;
  className?: string;
  open?: boolean;
}) {
  return (
    <div
      data-open={open}
      className={cn("flex flex-col gap-2 group", className)}
      style={{ "--label-width": `${width}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function KeyValueAccordion({
  open = false,
  toggleFunction,
}: {
  open: boolean;
  toggleFunction: (e: SyntheticEvent) => void;
}) {
  return (
    <Button
      onClick={(e) => toggleFunction && toggleFunction(e)}
      variant="ghost"
      className="mb-4 text-muted-foreground font-normal mt-2"
    >
      {open ? <span>Show less</span> : <span>Show more</span>}
    </Button>
  );
}
