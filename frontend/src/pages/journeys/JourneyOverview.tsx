import { Empty, EmptyTitle } from "@/components/ui/empty";
import useJourney from "@/hooks/useJourney";
import { useParams } from "react-router-dom";
import MarkdownEditor from "@/components/MarkdownEditor";
import DetailBox from "@/components/journey/detailBox";

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
    <div className="bg-neutral-100 pt-4 grow h-10 px-4 pb-24 overflow-x-scroll flex flex-row gap-4 justify-center">
      <MarkdownEditor
        value={journey.description || ""}
        onChange={handleDescriptionChange}
        className="max-w-4xl grow h-fit bg-card rounded-md shadow-sm"
      />
      <DetailBox journey={journey} />
    </div>
  );
}
