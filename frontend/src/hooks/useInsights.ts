import { updateInsight } from "@/api/insights";
import type { updateInsightDto } from "@shared/Dto/insight.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateInsightMutation = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (insight: updateInsightDto) => updateInsight(insight),
    onSuccess: (variables) => {
      query.invalidateQueries({ queryKey: ["insight", variables.id] });
    },
  });
};
