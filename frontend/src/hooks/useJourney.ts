import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchJourneyById,
  updateJourney,
  deleteJourney,
  restoreJourney,
} from "@/api/journeys";
import type { Journey } from "@/types/journey";
import { toast } from "sonner";

export default function useJourney(journeyId: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Journey, Error>({
    queryKey: ["journey", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });

  const updateJourneyMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: { name?: string; description?: string };
    }) => updateJourney(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
  });

  const deleteJourneyMutation = useMutation({
    mutationFn: (id: string) => deleteJourney(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] }); // Invalidate all journeys to remove the deleted one
      toast.success("Journey deleted successfully!", {
        action: {
          label: "Undo",
          onClick: () => restoreJourneyMutation.mutate(id),
        },
      });
    },
  });

  const restoreJourneyMutation = useMutation({
    mutationFn: (id: string) => restoreJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      toast.success("Journey restored successfully!");
    },
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
    updateJourney: updateJourneyMutation.mutate,
    deleteJourney: deleteJourneyMutation.mutate,
    restoreJourney: restoreJourneyMutation.mutate,
  };
}
