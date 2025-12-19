import { Empty, EmptyTitle } from "@/components/ui/empty";
import useJourney from "@/hooks/useJourney";
import { useParams } from "react-router-dom";

export default function JourneyOverview() {
  const journeyId = useParams().journeyId;

  const { journey, loading, error } = useJourney(journeyId as string);

  if (!journeyId) {
    return (
      <Empty>
        <EmptyTitle>404 Not Found</EmptyTitle>
      </Empty>
    );
  }

  if (loading) {
    return (
      <Empty>
        <EmptyTitle>Loading...</EmptyTitle>
      </Empty>
    );
  }

  if (error || !journey) {
    return (
      <Empty>
        <EmptyTitle>404 Not Found</EmptyTitle>
      </Empty>
    );
  }

  return <div className="mx-auto max-w-4xl p-4">{journey.description}</div>;
}
