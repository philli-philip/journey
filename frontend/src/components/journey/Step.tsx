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
import { ImageCell } from "./DimensionCells";
import { updateStep } from "../../api/steps";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface StepProps {
  step: Step;
  index: number;
  journeyId: string;
  onDeleteStep: ({
    stepId,
    journeyId,
  }: {
    stepId: string;
    journeyId: string;
  }) => void;
  isDragging?: boolean;
}

export default function StepComponent({
  step,
  journeyId,
  onDeleteStep,
  isDragging,
}: StepProps) {
  const { attributes, listeners, setNodeRef } = useSortable({ id: step.id });
  const { globalCollapsedState } = useGlobalCollapse();
  const queryClient = useQueryClient();
  const [name, setName] = useState(step.name || "Step without name");
  const [description, setDescription] = useState(step.description || "");
  const [pains, setPains] = useState(step.attributes.pains || "");
  const [insights, setInsights] = useState(step.attributes.insights || "");
  const [services, setServices] = useState(step.attributes.services || "");

  const stepMutation = useMutation({
    mutationFn: (update: Object) => updateStep(journeyId, step.id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
      console.log("cleared and set");
    },
    onError: (error) => {
      toast.error("Failed to update journey: " + error.message);
    },
  });

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => stepMutation.mutate({ name: e.target.value })}
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
              onClick={() =>
                onDeleteStep({ stepId: step.id, journeyId: journeyId })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image section - fixed height 120px */}
      <Cell open={!isImageCollapsed} height="h-30">
        <ImageCell img={step.img} stepId={step.id} />
      </Cell>

      {/* Description section*/}
      <Cell open={!isDescriptionCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => stepMutation.mutate({ description: e.target.value })}
          disabled={isDescriptionCollapsed}
        />
      </Cell>

      {/* Pain Point section*/}
      <Cell open={!isPainPointCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={pains || ""}
          onChange={(e) => setPains(e.target.value)}
          onBlur={(e) => stepMutation.mutate({ pains: e.target.value })}
          disabled={isPainPointCollapsed}
        />
      </Cell>

      {/* Insights section*/}
      <Cell open={!isInsightsCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={insights || ""}
          onChange={(e) => setInsights(e.target.value)}
          onBlur={(e) => stepMutation.mutate({ insights: e.target.value })}
          disabled={isInsightsCollapsed}
        />
      </Cell>

      {/* Services section*/}
      <Cell open={!isServicesCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={services || ""}
          onChange={(e) => setServices(e.target.value)}
          onBlur={(e) => stepMutation.mutate({ services: e.target.value })}
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
        "duration-300 ease-in-out *:duration-300 group flex ",
        open ? `${height} *:opacity-100` : "h-12 *:opacity-0 "
      )}
    >
      {children}
    </div>
  );
}
