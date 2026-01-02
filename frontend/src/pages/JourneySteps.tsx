import { Empty, EmptyTitle } from "@/components/ui/empty";
import { useParams } from "react-router-dom";
import useJourney from "@/hooks/useJourney";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Reorder } from "framer-motion";
import StepComponent from "@/components/journey/Step";
import { GlobalCollapseProvider } from "@/components/journey/GlobalCollapseContext";
import { LayerPanel } from "@/components/journey/GlobalCollapsePanel";
import { useEffect, useState } from "react";
import type { Step } from "@shared/types";
import LinkInsightDrawer from "@/components/insights/linkInsightDrawer";
import InsightDetails from "@/components/insights/insightDrawer";

export default function JourneyView() {
  const { journeyId } = useParams();
  const { journey, loading, error, updateJourney, deleteStep, addStep } =
    useJourney(journeyId as string);
  const [steps, setSteps] = useState<Step[]>(journey?.steps || []);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    async function setStepsFunction(newSteps: Step[]) {
      setSteps(newSteps);
    }

    if (
      journey?.steps &&
      JSON.stringify(journey.steps) !== JSON.stringify(steps)
    ) {
      setStepsFunction(journey.steps);
    }
  }, [journey?.steps, steps]);

  if (loading) {
    return <div>Loading journey...</div>;
  }

  if (error || !journey || !journey.steps || !journeyId) {
    return (
      <Empty>
        <EmptyTitle>Failed to fetch journey or steps not found</EmptyTitle>
      </Empty>
    );
  }

  return (
    <div className="flex flex-row flex-auto bg-neutral-100 h-0">
      <div
        className="flex flex-row gap-1 max-w-full pt-4 overflow-y-auto bg-neutral-100 flex-1 w-100"
        data-slot="cards"
      >
        <GlobalCollapseProvider>
          <LayerPanel />
          <Reorder.Group
            axis="x"
            values={steps}
            onReorder={(newOrder) => {
              setSteps(newOrder);
              updateJourney({
                id: journey.id,
                updates: { stepOrder: newOrder.map((step) => step.id) },
              });
            }}
            className="flex gap-1 h-fit flex-row items-stretch overflow-x-scroll flex-1 overflow-y-hidden pb-4"
            data-slot="journey-steps"
          >
            {steps.length === 0 ? (
              <Empty className="flex-1">
                <EmptyTitle>No steps yet. Add your first step!</EmptyTitle>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => addStep(journeyId)}
                >
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
                      onDeleteStep={() =>
                        deleteStep({
                          stepId: step.id,
                        })
                      }
                      journeyId={journeyId}
                    />
                  </Reorder.Item>
                ))}
              </>
            )}
          </Reorder.Group>
          <div className="px-2 py-1.5 shrink-0">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => addStep(journeyId)}
            >
              <span className="sr-only">Add Step</span>
              <PlusIcon size="16" />
            </Button>
          </div>
        </GlobalCollapseProvider>
        <LinkInsightDrawer />
        <InsightDetails />
      </div>
    </div>
  );
}
