import { GripVerticalIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import type { Step } from "@shared/types";
import { cn } from "@/lib/utils";
import { useGlobalCollapse } from "./GlobalCollapseContext";

interface StepProps {
  step: Step;
  index: number;
  onUpdateDescription: (index: number, newDescription: string) => void;
  onUpdateService: (index: number, newService: string) => void;
  onUpdateInsight: (index: number, newInsight: string) => void;
  onUpdatePainPoint: (index: number, newPainPoint: string) => void;
  onDeleteStep: (stepId: string) => void;
  onUpdateStepName: (index: number, newName: string) => void;
  isDragging?: boolean;
}

export default function StepComponent({
  step,
  index,
  onUpdateDescription,
  onUpdateService,
  onUpdateInsight,
  onUpdatePainPoint,
  onDeleteStep,
  onUpdateStepName,
  isDragging,
}: StepProps) {
  const { attributes, listeners, setNodeRef } = useSortable({ id: step.id });

  const { globalCollapsedState } = useGlobalCollapse();

  const isDescriptionCollapsed = globalCollapsedState.description;
  const isPainPointCollapsed = globalCollapsedState.painPoints;
  const isInsightsCollapsed = globalCollapsedState.insights;
  const isServicesCollapsed = globalCollapsedState.services;
  const isImageCollapsed = globalCollapsedState.image;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-card rounded shadow-sm divide-y min-w-72 flex flex-col",
        isDragging && "shadow-2xl"
      )}
    >
      {/* Drag handle and title with action menu */}
      <div className="flex flex-row items-center justify-between h-12 px-2 gap-2">
        <GripVerticalIcon
          size={16}
          className="text-muted-foreground cursor-move"
          {...attributes}
          {...listeners}
        />
        <input
          type="text"
          className="text-foreground font-semibold truncate flex-1 bg-transparent focus:outline-none"
          value={step.name}
          onChange={(e) => onUpdateStepName(index, e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              asChild
              size="icon-sm"
              className="muted-foreground"
            >
              <div>
                <span className="sr-only">actions</span>
                <MoreVerticalIcon size={12} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async (event) => {
                event.preventDefault();
                onDeleteStep(step.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image section - fixed height 120px */}
      <Cell open={!isImageCollapsed} height="h-30">
        <div className="rounded-md">
          {!isImageCollapsed && step.img && (
            <img src={step.img} alt="" className="object-cover w-full h-full" />
          )}
        </div>
      </Cell>

      {/* Description section*/}
      <Cell open={!isDescriptionCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={step.description}
          onChange={(e) => onUpdateDescription(index, e.target.value)}
          disabled={isDescriptionCollapsed}
        />
      </Cell>

      {/* Pain Point section*/}
      <Cell open={!isPainPointCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={step.attributes?.pains || ""}
          onChange={(e) => onUpdatePainPoint(index, e.target.value)}
          disabled={isPainPointCollapsed}
        />
      </Cell>

      {/* Insights section*/}
      <Cell open={!isInsightsCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={step.attributes?.insights || ""}
          onChange={(e) => onUpdateInsight(index, e.target.value)}
          disabled={isInsightsCollapsed}
        />
      </Cell>

      {/* Services section*/}
      <Cell open={!isServicesCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={step.attributes?.services || ""}
          onChange={(e) => onUpdateService(index, e.target.value)}
          disabled={isServicesCollapsed}
        />
      </Cell>
    </div>
  );
}

function Cell({
  children,
  open,
  height = "h-20",
}: {
  children: JSX.Element;
  open: boolean;
  height?: string;
}) {
  return (
    <div
      className={cn(
        "duration-300 ease-in-out *:duration-300",
        open ? `${height} *:opacity-100` : "h-12 *:opacity-0 "
      )}
    >
      {children}
    </div>
  );
}
