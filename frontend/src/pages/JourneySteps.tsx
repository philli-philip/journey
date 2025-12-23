import { Empty, EmptyTitle } from "@/components/ui/empty";
import { useParams } from "react-router-dom";
import useJourney from "@/hooks/useJourney";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJourney } from "@/api/journeys";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { randomID } from "@shared/randomID";
import { Reorder } from "framer-motion";
import StepComponent from "@/components/journey/Step";
import { GlobalCollapseProvider } from "@/components/journey/GlobalCollapseContext";
import { LayerPanel } from "@/components/journey/GlobalCollapsePanel";
import { useState } from "react";
import type { Step } from "@shared/types";

export default function JourneyView() {
  const { journeyId } = useParams();
  const { journey, loading, error } = useJourney(journeyId as string);
  const [steps, setSteps] = useState<Step[]>(journey?.steps || []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const updateJourneyMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: { name?: string; description?: string; steps?: string };
    }) => updateJourney(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
    onError: (error) => {
      toast.error("Failed to update journey: " + error.message);
    },
  });

  const onUpdateStepAttribute = (
    stepIndex: number,
    attribute: string,
    newValue: string
  ) => {
    const updatedSteps = steps.map((step, i) => {
      if (i === stepIndex) {
        if (attribute === "description") {
          return { ...step, description: newValue };
        } else if (
          step.attributes &&
          (attribute === "pains" ||
            attribute === "insights" ||
            attribute === "services")
        ) {
          return {
            ...step,
            attributes: { ...step.attributes, [attribute]: newValue },
          };
        }
      }
      return step;
    });
    if (!journey) {
      return steps;
    }
    updateJourneyMutation.mutate({
      id: journey.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  const onDeleteStep = (stepId: string) => {
    if (!journey) {
      return steps;
    }
    const updatedSteps = steps.filter((step) => step.id !== stepId);
    setSteps(updatedSteps);
    updateJourneyMutation.mutate({
      id: journey.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  const onUpdateStepName = (stepIndex: number, newName: string) => {
    const updatedSteps = steps.map((step, i) => {
      if (i === stepIndex) {
        return { ...step, name: newName };
      }
      return step;
    });
    if (!journey) {
      return;
    }
    setSteps(updatedSteps);
    updateJourneyMutation.mutate({
      id: journey.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  function AddStep() {
    const newStep = {
      id: randomID(),
      name: "New Step",
      description: "",
      img: "",
      attributes: {
        pains: "",
        insights: "",
        services: "",
      },
    };
    if (!journey?.id) return;
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    updateJourneyMutation.mutate({
      id: journey.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  }

  if (loading) {
    return <div>Loading journey...</div>;
  }

  if (error || !journey || !journey.steps) {
    return (
      <Empty>
        <EmptyTitle>Failed to fetch journey or steps not found</EmptyTitle>
      </Empty>
    );
  }

  return (
    <div
      className="flex gap-1 flex-row pt-4 bg-neutral-100 flex-1 shrink items-stretch"
      data-slot="cards"
    >
      <GlobalCollapseProvider>
        <LayerPanel />
        <Reorder.Group
          axis="x"
          values={steps}
          onReorder={(newOrder) => {
            setSteps(newOrder);
            updateJourneyMutation.mutate({
              id: journey.id,
              updates: { steps: JSON.stringify(newOrder) },
            });
          }}
          className="flex gap-1 flex-row items-stretch flex-1 shrink w-50 overflow-x-scroll"
          data-slot="journey-steps"
        >
          {steps.length === 0 ? (
            <Empty className="flex-1">
              <EmptyTitle>No steps yet. Add your first step!</EmptyTitle>
              <Button variant="default" size="lg" onClick={AddStep}>
                <PlusIcon size="16" className="mr-2" />
                Add Step
              </Button>
            </Empty>
          ) : (
            <>
              {steps.map((step, index) => (
                <Reorder.Item
                  key={step.id}
                  value={step}
                  onDragStart={() => setActiveId(step.id)}
                  onDragEnd={() => setActiveId(null)}
                  className="flex-1"
                >
                  <StepComponent
                    step={step}
                    index={index}
                    isDragging={activeId === step.id}
                    onUpdateDescription={(idx, val) =>
                      onUpdateStepAttribute(idx, "description", val)
                    }
                    onUpdateService={(idx, val) =>
                      onUpdateStepAttribute(idx, "services", val)
                    }
                    onUpdateInsight={(idx, val) =>
                      onUpdateStepAttribute(idx, "insights", val)
                    }
                    onUpdatePainPoint={(idx, val) =>
                      onUpdateStepAttribute(idx, "pains", val)
                    }
                    onDeleteStep={onDeleteStep}
                    onUpdateStepName={onUpdateStepName}
                  />
                </Reorder.Item>
              ))}
              <div className="px-2 py-1.5 shrink-0">
                <Button variant="outline" size="icon-sm" onClick={AddStep}>
                  <span className="sr-only">Add Step</span>
                  <PlusIcon size="16" />
                </Button>
              </div>
            </>
          )}
        </Reorder.Group>
      </GlobalCollapseProvider>
    </div>
  );
}
