import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchJourneyById,
  updateJourney,
  deleteJourney,
  restoreJourney,
} from "@/api/journeys";
import type { UserJourney, Step } from "@shared/types";
import { toast } from "sonner";

export default function useJourney(journeyId: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<UserJourney, Error>({
    queryKey: ["journey", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });

  const updateJourneyMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
      stepId,
      attribute,
      newValue,
    }: {
      id: string;
      updates?: { name?: string; description?: string };
      stepId?: string;
      attribute?: string;
      newValue?: string;
    }) => {
      if (stepId && attribute && newValue !== undefined) {
        const currentJourney = queryClient.getQueryData<UserJourney>([
          "journey",
          id,
        ]);
        if (!currentJourney) {
          throw new Error("Journey not found in cache");
        }

        const currentSteps = (
          typeof currentJourney.steps === "string"
            ? JSON.parse(currentJourney.steps)
            : currentJourney.steps
        ) as Step[];

        const updatedSteps = currentSteps.map((step: Step) => {
          if ((step as Step).id === stepId) {
            if (attribute === "description") {
              return { ...step, description: newValue };
            } else if (step.attributes && attribute) {
              return {
                ...step,
                attributes: { ...step.attributes, [attribute]: newValue },
              };
            }
          }
          return step;
        });

        return updateJourney(id, { steps: JSON.stringify(updatedSteps) });
      } else if (updates) {
        return updateJourney(id, updates);
      }
      throw new Error("Invalid update parameters");
    },
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
  };
}
