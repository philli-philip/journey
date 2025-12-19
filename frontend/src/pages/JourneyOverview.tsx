import { Empty, EmptyTitle } from "@/components/ui/empty";
import useJourney from "@/hooks/useJourney";
import { useParams } from "react-router-dom";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function JourneyOverview() {
  const journeyId = useParams().journeyId;

  const { journey, loading, error, updateJourney } = useJourney(
    journeyId as string
  );

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

  const handleDescriptionChange = (newDescription: string) => {
    if (journeyId) {
      updateJourney({
        id: journeyId,
        updates: { description: newDescription },
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <MarkdownEditor
        value={journey.description || ""}
        onChange={handleDescriptionChange}
      />
    </div>
  );
}
