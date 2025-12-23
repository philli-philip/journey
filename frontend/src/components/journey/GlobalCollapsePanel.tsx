import { useGlobalCollapse } from "./GlobalCollapseContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export const LayerPanel = () => {
  const { globalCollapsedState, toggleGlobalCollapse } = useGlobalCollapse();

  const sections = [
    {
      key: "image",
      label: "Image",
      expandedHeight: "h-30",
    },
    {
      key: "description",
      label: "Description",
      expandedHeight: "h-20",
    },
    {
      key: "painPoints",
      label: "Pain Points",
      expandedHeight: "h-20",
    },
    {
      key: "insights",
      label: "Insights",
      expandedHeight: "h-20",
    },
    {
      key: "services",
      label: "Services",
      expandedHeight: "h-20",
    },
  ];

  return (
    <div className="sticky divide-y left-0 top-0 w-72 z-10 text-base text-secondary-foreground">
      <div className="pr-2 pl-4 h-12 pt-3">
        <span>Steps</span>
      </div>
      {sections.map((section) => (
        <div
          key={section.key}
          className={cn(
            "flex flex-row justify-between items-start pr-2 pl-4 pt-2 duration-300 ease-in-out",
            globalCollapsedState[section.key] ? "h-12" : section.expandedHeight
          )}
        >
          <span>{section.label}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleGlobalCollapse(section.key)}
            className="h-6 w-6 p-0"
          >
            {globalCollapsedState[section.key] ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronUp size={12} />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};
