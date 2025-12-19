import { useQuery } from "@tanstack/react-query";
import { fetchAllJourneys } from "@/api/journeys";
import type { UserJourney } from "@shared/types";

export default function useAllJourneys() {
  const { data, isLoading, error } = useQuery<UserJourney[]>({
    queryKey: ["journeys"],
    queryFn: fetchAllJourneys,
  });

  return {
    journeys: data,
    loading: isLoading,
    error: error ? true : false,
  };
}
