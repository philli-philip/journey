import { cn } from "@/lib/utils";

export function KeyValue({
  label,
  value,
  className,
}: {
  label: string | JSX.Element;
  value?: string | JSX.Element;
  className?: string;
}) {
  return (
    <div className={cn("flex px-4 flex-row min-h-8 text-sm", className)}>
      <span className="text-neutral-500 w-(--label-width) pt-2">{label}</span>
      <span className="text-neutral-900 pt-2">{value}</span>
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
}: {
  children?: React.ReactNode[] | React.ReactNode;
  width?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      style={{ "--label-width": `${width}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
