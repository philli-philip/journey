import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Lightbulb, Link } from "lucide-react";
import type { Insight, InsightTypes } from "@shared/types";
import { getAllInsights, linkInsightToStep } from "@/api/insights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PreparedDrawer from "../layouts/Drawer";

export default function LinkInsightDrawer() {
  const [searchParams] = useSearchParams();
  return (
    <PreparedDrawer
      open={searchParams.get("action") === "add-insight"}
      title="Link insight"
    >
      <LinkInsight
        stepId={searchParams.get("id") || ""}
        type={(searchParams.get("type") as InsightTypes) || ""}
      />
    </PreparedDrawer>
  );
}

function LinkInsight({ stepId, type }: { stepId: string; type: InsightTypes }) {
  const [searchValue, setSearchValue] = useState("");
  const [, setSearchParams] = useSearchParams();
  const params = useParams();
  const queryClient = useQueryClient();

  const { data: insights } = useQuery({
    queryKey: ["insights", type],
    queryFn: () => getAllInsights({ type }),
  });

  const insightMutation = useMutation({
    mutationFn: (id: string) => linkInsightToStep({ id, stepId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journey", params.journeyId],
      });
    },
  });

  const handleToggle = (id: string) => {
    insightMutation.mutate(id);
    setSearchParams({});
  };
  return (
    <div className="px-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder={`Search ${type} insights...`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="border rounded p-2 shadow-xs"
      />

      {insights
        ?.filter((insight: Insight) =>
          insight.title.toLowerCase().includes(searchValue.toLowerCase())
        )
        ?.map((insight: Insight) => (
          <div
            key={insight.id}
            className="border rounded p-2 pr-0.5 shadow-xs flex flex-row items-center gap-2"
          >
            <Lightbulb size="16" />
            <span className="flex-1 truncate">{insight.title}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle(insight.id)}
            >
              <Link /> Link
            </Button>
          </div>
        ))}
    </div>
  );
}
