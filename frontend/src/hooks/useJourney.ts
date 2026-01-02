import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchJourneyById,
  updateJourney,
  deleteJourney,
  restoreJourney,
} from "@/api/journeys";
import type { UserJourney } from "@shared/types";
import { toast } from "sonner";
import { createStep, deleteStep } from "@/api/steps";

export default function useJourney(journeyId: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<UserJourney, Error>({
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
      updates: {
        name?: string;
        description?: string;
        stepOrder?: string[];
      };
    }) => updateJourney(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
    onError: (error) => {
      toast.error("Failed to update journey: " + error.message);
    },
  });

  const deleteJourneyMutation = useMutation({
    mutationFn: (id: string) => deleteJourney(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["journey"] }); // Invalidate all journeys to remove the deleted one
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
      queryClient.invalidateQueries({ queryKey: ["journey"] });
      toast.success("Journey restored successfully!");
    },
  });

  const handleCreateStep = useMutation({
    mutationFn: (journeyId: string) => createStep(journeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
    onError: (error) => {
      toast.error("Failed to create a step: " + error.message);
    },
  });

  const handleDeleteStep = useMutation({
    mutationFn: ({ stepId }: { stepId: string }) => deleteStep(stepId),
    onSuccess: () => {
      toast.success("Step deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
    onError: (error) => {
      toast.error("Failed to delete step: " + error.message);
    },
  });

  const memoizedJourney = useMemo(() => {
    return data
      ? {
          ...data,
          steps:
            typeof data.steps === "string"
              ? JSON.parse(data.steps)
              : data.steps,
        }
      : undefined;
  }, [data]);

  return {
    journey: memoizedJourney,
    loading: isLoading,
    error: error ? true : false,
    updateJourney: updateJourneyMutation.mutate,
    deleteJourney: deleteJourneyMutation.mutate,
    restoreJourney: restoreJourneyMutation.mutate,
    addStep: handleCreateStep.mutate,
    deleteStep: handleDeleteStep.mutate,
  };
}
