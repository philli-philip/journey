import { Empty, EmptyTitle } from "@/components/ui/empty";
import useJourney from "@/hooks/useJourney";
import { useParams } from "react-router-dom";

export default function JourneyOverview() {
  const journeyId = useParams().journeyId;

  if (!journeyId) {
    return (
      <Empty>
        <EmptyTitle>404 Not Found</EmptyTitle>
      </Empty>
    );
  }

  const journey = useJourney(journeyId);

  if (journey.loading) {
    return (
      <Empty>
        <EmptyTitle>Loading...</EmptyTitle>
      </Empty>
    );
  }

  if (journey.error || !journey.journey) {
    return (
      <Empty>
        <EmptyTitle>404 Not Found</EmptyTitle>
      </Empty>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">{journey.journey.description}</div>
  );
}
