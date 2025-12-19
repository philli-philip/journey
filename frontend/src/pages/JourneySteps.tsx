import { Empty, EmptyTitle } from "@/components/ui/empty";
import { useParams } from "react-router-dom";
import { Layer } from "@/components/journey/layer";
import { type Journey } from "@/types/journey";
import useJourney from "@/hooks/useJourney";

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

  const currentJourney: Journey = journey;

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
        <Layer title={"Description"} data={descriptions} />
        <Layer title={"Image"} data={images} renderItem={renderImage} />
        <Layer title={"Pain Point"} data={painPoints} />
        <Layer title={"Insights"} data={insights} />
        <Layer title={"Services"} data={services} />
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
