import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function DetailHeader({
  children,
}: {
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <header className="flex flex-row w-full justify-between items-center px-1 gap-2 border-b h-11">
      <Button asChild variant="ghost" size="icon" className="cursor-pointer">
        <SidebarTrigger />
      </Button>
      {children}
    </header>
  );
}

export function HeaderTitle({
  children = "Header",
  className,
}: {
  children?: JSX.Element | string;
  className?: string;
}) {
  return <h1 className={cn("font-semibold", className)}>{children}</h1>;
}
