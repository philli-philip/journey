import { useEffect, useState } from "react";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Layer } from "@/components/journey/layer";
import { fetchJourneyById } from "@/api/journeys";
import { type Journey } from "@/types/journey";

export default function JourneyView() {
  let { journeyId } = useParams();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getJourney() {
      if (!journeyId) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchJourneyById(journeyId);
        setJourney(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getJourney();
  }, [journeyId]);

  if (loading) {
    return <div>Loading journey...</div>;
  }

  if (error || !journey) {
    return (
      <Empty>
        <EmptyTitle>Failed to fetch journey</EmptyTitle>
      </Empty>
    );
  }

  const tiles = journey.steps.map((step) => step.name);
  const descriptions = journey.steps.map((step) => step.description);
  const images = journey.steps.map((step) => step.img);
  const painPoints = journey.steps.map((step) => step.attributes.pains);
  const insights = journey.steps.map((step) => step.attributes.insights);
  const services = journey.steps.map((step) => step.attributes.services);
  const empty = journey.steps.map(() => "");

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
      <div className="flex items-center flex-row gap-1 border-b p-1 border-border w-full">
        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
        >
          <SidebarTrigger />
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeftIcon size="16" className="text-secondary-foreground" />
            <span className="text-muted-foreground">Journeys</span>
          </Link>
        </Button>
        <span className="text-lg text-gray-400">/</span>
        <span className="font-semibold text-foreground pl-2">
          {journey.name}
        </span>
      </div>
      <div data-slot="journey-header" className="p-2 border-b">
        <h1 className="font-semibold text-xl text-foreground pl-2  pt-4">
          {journey.name}
        </h1>
      </div>
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
