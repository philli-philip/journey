import { fetchJourneyById } from "@/api/journeys";
import type { Journey } from "@/types/journey";
import { useQuery } from "@tanstack/react-query";

export default function useJourney(journeyId: string) {
  const { data, isLoading, error } = useQuery<Journey, Error>({
    queryKey: ["journey", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });

  return {
    journey: data
      ? {
          ...data,
          steps:
            typeof data.steps === "string"
              ? JSON.parse(data.steps)
              : data.steps,
        }
      : undefined,
    loading: isLoading,
    error: error ? true : false,
    setJourney: () => {},
  };
}
