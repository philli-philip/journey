import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllJourneys, createJourney } from "@/api/journeys";
import type { UserJourney } from "@shared/types";

export default function useAllJourneys({
  filter,
}: {
  filter: { personaSlug?: string };
}) {
  const { data, isLoading, error } = useQuery<UserJourney[]>({
    queryKey: ["journeys", filter],
    queryFn: () => fetchAllJourneys(filter),
  });

  const queryClient = useQueryClient();

  const createJourneyMutation = useMutation({
    mutationFn: createJourney,
    onSuccess: (newJourney) => {
      queryClient.invalidateQueries({ queryKey: ["journeys", filter] });
      return newJourney;
    },
  });

  return {
    journeys: data,
    loading: isLoading,
    error: error ? true : false,
    createJourney: createJourneyMutation.mutateAsync,
  };
}
