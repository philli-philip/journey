import { Empty, EmptyTitle } from "@/components/ui/empty";
import { useParams } from "react-router-dom";
import { Layer } from "@/components/journey/layer";
import type { UserJourney } from "@shared/types";
import useJourney from "@/hooks/useJourney";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJourney } from "@/api/journeys";
import { toast } from "sonner";

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

  const tiles = currentJourney.steps.map((step) => step.name);
  const descriptions = currentJourney.steps.map((step) => step.description);
  const images = currentJourney.steps.map((step) => step.img);
  const painPoints = currentJourney.steps.map((step) => step.attributes.pains);
  const insights = currentJourney.steps.map((step) => step.attributes.insights);
  const services = currentJourney.steps.map((step) => step.attributes.services);
  const empty = currentJourney.steps.map(() => "");

  function renderTitle(title: string) {
    return (
      <span className="text-foreground font-bold capitalize">{title}</span>
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
    <div className="w-full h-full">
      <div className="pt-4 bg-neutral-50 h-full">
        <Layer
          title={"Step"}
          data={tiles}
          hideToggle
          renderItem={renderTitle}
          className="rounded-t-lg"
        />
        <Layer title={"Image"} data={images} renderItem={renderImage} />
        <Layer
          title={"Description"}
          data={descriptions}
          onUpdateItem={onUpdateDescription}
        />
        <Layer
          title={"Pain Point"}
          data={painPoints}
          onUpdateItem={onUpdatePainPoint}
        />
        <Layer
          title={"Insights"}
          data={insights}
          onUpdateItem={onUpdateInsight}
        />
        <Layer
          title={"Services"}
          data={services}
          onUpdateItem={onUpdateService}
        />
        <Layer
          title={""}
          data={empty}
          hideToggle
          className="border-none rounded-b-lg"
        />
      </div>
    </div>
  );
}
