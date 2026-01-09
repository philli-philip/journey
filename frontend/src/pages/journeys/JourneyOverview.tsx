import { Empty, EmptyTitle } from "@/components/ui/empty";
import useJourney from "@/hooks/useJourney";
import { useDebounce } from "@/hooks/useDebounce";
import { useParams } from "react-router-dom";
import MarkdownEditor from "@/components/MarkdownEditor";
import DetailBox from "@/components/journey/detailBox";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

export default function JourneyOverview() {
  const journeyId = useParams().journeyId;
  const client = useQueryClient();

  const { journey, loading, error, updateJourney } = useJourney(
    journeyId as string
  );
  const [name, setName] = useState(journey?.name ?? "");

  const debouncedUpdateJourney = useCallback(
    (newDescription: string) => {
      if (journeyId) {
        updateJourney({
          id: journeyId,
          updates: { description: newDescription },
        });
      }
    },
    [journeyId, updateJourney]
  );

  const handleDescriptionChange = useDebounce(debouncedUpdateJourney, 3000);

  const handleTitleUpdate = async () => {
    if (!journeyId || !journey || name === journey.name) {
      return;
    }
    updateJourney(
      {
        id: journeyId,
        updates: { name },
      },
      {
        onSuccess: () =>
          client.invalidateQueries({ queryKey: ["journeys", journeyId] }),
      }
    );
  };

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

  return (
    <div className="bg-neutral-100 pt-4 grow h-10 px-4 pb-24 overflow-x-scroll flex flex-col gap-4">
      <div className="max-w-4xl mx-auto w-full h-fit bg-card rounded-xl shadow-sm p-6">
        <Input
          value={name}
          className="px-4 pt-8 text-3xl pb-8 font-semibold focus-visible:ring-transparent shadow-none border-none focus-visible:outline-transparent"
          onChange={(e) => setName(e.currentTarget.value)}
          onBlur={handleTitleUpdate}
        />
        <DetailBox journey={journey} />
        <MarkdownEditor
          value={journey.description || ""}
          onChange={handleDescriptionChange}
          className=""
        />
      </div>
    </div>
  );
}
