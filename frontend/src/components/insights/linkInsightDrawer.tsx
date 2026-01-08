import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Link, Plus } from "lucide-react";
import type { Insight, InsightTypes } from "@shared/types";
import { getAllInsights, linkInsightToStep } from "@/api/insights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PreparedDrawer from "../layouts/Drawer";
import { InsightIcon } from "./insight-icons";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";
import { CreateInsightForm } from "./createInsightDrawer";
import { Input } from "../ui/input";

export default function LinkInsightDrawer() {
  const [searchParams] = useSearchParams();
  return (
    <PreparedDrawer
      open={searchParams.get("action") === "add-insight"}
      title="Link insight"
    >
      <LinkInsight
        stepId={searchParams.get("id") || ""}
        type={searchParams.get("type") as InsightTypes}
      />
    </PreparedDrawer>
  );
}

function LinkInsight({ stepId, type }: { stepId: string; type: InsightTypes }) {
  const [, setSearchParams] = useSearchParams();
  const params = useParams();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "create">("list");

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
  const handleSucess = () => {
    queryClient.invalidateQueries({ queryKey: ["insights"] });
    setView("list");
  };

  const List = ({ insights }: { insights: Insight[] }) => {
    const [searchValue, setSearchValue] = useState("");

    const filteredInsights = insights?.filter((insight: Insight) =>
      insight.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <div className="px-4 flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Input
            type="text"
            placeholder={`Search ${type} insights...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border p-2 shadow-xs"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => setView("create")}
          >
            <Plus size="16" />
            <span className="sr-only">Create {type}</span>
          </Button>
        </div>
        {filteredInsights.length === 0 ? (
          <Empty>
            <EmptyTitle>No insights</EmptyTitle>
            <EmptyContent>
              <Button onClick={() => setView("create")}>
                <Plus size="16" />
                New {type}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          filteredInsights?.map((insight: Insight) => (
            <div
              key={insight.id}
              className="border rounded-md p-2 pr-0.5 shadow-xs flex flex-row items-center gap-2"
            >
              <InsightIcon type={type} size="16" />
              <span className="flex-1 truncate">{insight.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggle(insight.id)}
              >
                <Link /> Link
              </Button>
            </div>
          ))
        )}
      </div>
    );
  };

  if (!insights) {
    return (
      <Empty>
        <EmptyTitle>Error while loading insights</EmptyTitle>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {view === "list" ? (
        <List insights={insights} />
      ) : (
        <CreateInsightForm onSuccess={handleSucess} defaultType={type} />
      )}
    </div>
  );
}
