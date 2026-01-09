import { Edit, GripVerticalIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Step } from "@shared/types";
import { cn } from "@/lib/utils";
import { useGlobalCollapse } from "./GlobalCollapseContext";
import { ImageCell, InsightCell } from "./DimensionCells";
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
  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({
      id: step.id,
    });
  const { globalCollapsedState } = useGlobalCollapse();
  const queryClient = useQueryClient();
  const [name, setName] = useState(step.name || "Step without name");
  const [description, setDescription] = useState(step.description || "");
  const [services, setServices] = useState(
    typeof step.attributes.services === "string" ? step.attributes.services : ""
  );
  const [editingTitle, setEditedTitle] = useState(false);

  const stepMutation = useMutation({
    mutationFn: (update: object) => updateStep(journeyId, step.id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
    onError: (error) => {
      toast.error("Failed to update journey: " + error.message);
    },
  });

  const isDescriptionCollapsed = globalCollapsedState.description;
  const isPainPointCollapsed = globalCollapsedState.painPoints;
  const isGainPointCollapsed = globalCollapsedState.gains;
  const isInsightsCollapsed = globalCollapsedState.observations;
  const isServicesCollapsed = globalCollapsedState.services;
  const isImageCollapsed = globalCollapsedState.image;
  const isNeedsCollapsed = globalCollapsedState.needs;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={cn(
        "bg-card rounded group/step shadow-sm divide-y min-w-72 flex flex-col",
        isDragging && "shadow-2xl z-100"
      )}
    >
      {/* Drag handle and title with action menu */}
      <div className="flex flex-row group/title items-center justify-between h-12 px-2 gap-2">
        <GripVerticalIcon
          size="16"
          className="text-muted-foreground cursor-move shrink-0 w-0 duration-75 flex group-hover/title:w-6"
          {...attributes}
          {...listeners}
        />
        {editingTitle ? (
          <input
            type="text"
            className="text-foreground w-10 font-semibold truncate flex-1 bg-transparent focus:outline-none"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => {
              setEditedTitle(false);
              stepMutation.mutate({ name: e.target.value });
            }}
          />
        ) : (
          <button
            className="appearance-none flex flex-row rounded flex-1 cursor-pointer items-center gap-2"
            onClick={() => setEditedTitle(true)}
          >
            <span className="text-foreground font-semibold">{name}</span>
            <span className="sr-only">Edit name of step</span>
            <Edit
              size="16"
              className="group-hover/title:opacity-100 opacity-0 duration-75 text-muted-foreground"
            />
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              asChild
              size="icon-sm"
              className="muted-foreground opacity-0 group-hover/title:opacity-100 duration-75"
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
      <Cell open={!isImageCollapsed} height="h-42">
        <ImageCell imageId={step.imageId} stepId={step.id} />
      </Cell>

      {/* Description section*/}
      <Cell open={!isDescriptionCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none placeholder:text-transparent duration-75 hover:placeholder:text-muted-foreground cursor-pointer"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => stepMutation.mutate({ description: e.target.value })}
          disabled={isDescriptionCollapsed}
          placeholder="Add description ..."
        />
      </Cell>

      {/* Insights section*/}
      <Cell open={!isInsightsCollapsed}>
        <InsightCell
          stepId={step.id}
          type="observation"
          items={
            step.attributes.observations instanceof Array
              ? step.attributes.observations
              : []
          }
        />
      </Cell>

      {/* Pain Point section*/}
      <Cell open={!isPainPointCollapsed}>
        <InsightCell
          stepId={step.id}
          type="pain"
          items={
            step.attributes.pains instanceof Array ? step.attributes.pains : []
          }
        />
      </Cell>

      {/* Gain Point section*/}
      <Cell open={!isGainPointCollapsed}>
        <InsightCell
          stepId={step.id}
          type="gain"
          items={
            step.attributes.pains instanceof Array ? step.attributes.pains : []
          }
        />
      </Cell>

      {/* Needs section*/}
      <Cell open={!isNeedsCollapsed}>
        <InsightCell
          stepId={step.id}
          type="need"
          items={
            step.attributes.needs instanceof Array ? step.attributes.needs : []
          }
        />
      </Cell>

      {/* Services section*/}
      <Cell open={!isServicesCollapsed}>
        <textarea
          className="w-full rounded-md p-2 text-sm focus:outline-none resize-none"
          value={services}
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
  height = "h-60",
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
