import { Empty, EmptyTitle } from "@/components/ui/empty";
import { useParams } from "react-router-dom";
import { Layer } from "@/components/journey/layer";
import type { UserJourney } from "@shared/types";
import useJourney from "@/hooks/useJourney";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJourney } from "@/api/journeys";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { randomID } from "@shared/randomID";

export default function JourneyView() {
  const { journeyId } = useParams();
  const { journey, loading, error } = useJourney(journeyId as string);

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

  const currentJourney: UserJourney = journey;

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

  const onUpdateDescription = (index: number, newDescription: string) => {
    const updatedSteps = currentJourney.steps.map((step, i) =>
      i === index ? { ...step, description: newDescription } : step
    );
    updateJourneyMutation.mutate({
      id: currentJourney.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  const onUpdateService = (index: number, newService: string) => {
    const updatedSteps = currentJourney.steps.map((step, i) =>
      i === index
        ? {
            ...step,
            attributes: { ...step.attributes, services: newService },
          }
        : step
    );
    updateJourneyMutation.mutate({
      id: currentJourney.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  const onUpdateInsight = (index: number, newInsight: string) => {
    const updatedSteps = currentJourney.steps.map((step, i) =>
      i === index
        ? {
            ...step,
            attributes: { ...step.attributes, insights: newInsight },
          }
        : step
    );
    updateJourneyMutation.mutate({
      id: currentJourney.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  const onUpdatePainPoint = (index: number, newPainPoint: string) => {
    const updatedSteps = currentJourney.steps.map((step, i) =>
      i === index
        ? {
            ...step,
            attributes: { ...step.attributes, pains: newPainPoint },
          }
        : step
    );
    updateJourneyMutation.mutate({
      id: currentJourney.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  };

  const titles = currentJourney.steps.map((step) => step.name);
  const descriptions = currentJourney.steps.map((step) => step.description);
  const images = currentJourney.steps.map((step) => step.img);
  const painPoints = currentJourney.steps.map((step) => step.attributes.pains);
  const insights = currentJourney.steps.map((step) => step.attributes.insights);
  const services = currentJourney.steps.map((step) => step.attributes.services);

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
    const updatedSteps = [...currentJourney.steps, newStep];
    updateJourneyMutation.mutate({
      id: currentJourney.id,
      updates: { steps: JSON.stringify(updatedSteps) },
    });
  }

  function renderTitle(title: string, stepId: string) {
    function deleteStep(journeyId: string, stepId: string) {
      const updatedSteps = currentJourney.steps.filter(
        (step) => step.id !== stepId
      );
      updateJourneyMutation.mutate({
        id: journeyId,
        updates: { steps: JSON.stringify(updatedSteps) },
      });
    }

    return (
      <div className="flex flex-row items-center justify-between">
        <span className="text-foreground font-bold capitalize">{title}</span>
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
                deleteStep(currentJourney.id, stepId);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  function renderImage(img: string) {
    return (
      <img
        src={img}
        alt=""
        className="object-cover max-w-full rounded-md border border-border"
      />
    );
  }

  return (
    <div className=" pt-4 flex flex-row bg-neutral-50 h-full">
      <div className="overflow-x-scroll h-full">
        <Layer
          title={"Step"}
          data={titles}
          hideToggle
          stepIds={currentJourney.steps.map((step) => step.id)}
          renderItem={(stepId, title) => renderTitle(title, stepId)}
          className="rounded-t-lg"
        />
        <Layer
          title={"Image"}
          data={images}
          renderItem={renderImage}
          stepIds={currentJourney.steps.map((step) => step.id)}
        />
        <Layer
          title={"Description"}
          data={descriptions}
          stepIds={currentJourney.steps.map((step) => step.id)}
          onUpdateItem={onUpdateDescription}
        />
        <Layer
          title={"Pain Point"}
          data={painPoints}
          stepIds={currentJourney.steps.map((step) => step.id)}
          onUpdateItem={onUpdatePainPoint}
        />
        <Layer
          title={"Insights"}
          data={insights}
          stepIds={currentJourney.steps.map((step) => step.id)}
          onUpdateItem={onUpdateInsight}
        />
        <Layer
          title={"Services"}
          data={services}
          stepIds={currentJourney.steps.map((step) => step.id)}
          onUpdateItem={onUpdateService}
        />
      </div>
      <div className="px-2">
        <Button variant="outline" size="icon-sm" onClick={AddStep}>
          <span className="sr-only">Add Step</span>
          <PlusIcon size="16" />
        </Button>
      </div>
    </div>
  );
}
