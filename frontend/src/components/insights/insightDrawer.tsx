import { useParams, useSearchParams } from "react-router-dom";
import PreparedDrawer from "../layouts/Drawer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInsight } from "@/api/insights";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { deleteInsightConnection } from "@/api/steps";

export default function InsightDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const journeyId = params.journeyId;
  const insightId = searchParams.get("insight");
  const stepId = searchParams.get("step");
  const queryClient = useQueryClient();

  const { data: insight } = useQuery({
    queryKey: ["insight", insightId],
    queryFn: () => getInsight(insightId || ""),
  });

  const { mutate } = useMutation({
    mutationFn: ({
      insightId,
      stepId,
    }: {
      insightId: string;
      stepId: string;
    }) => deleteInsightConnection(stepId, insightId),
    onSuccess() {
      toast.success("Insight connection deleted");
      setSearchParams({});
      queryClient.invalidateQueries({ queryKey: ["journey", journeyId] });
    },
  });

  if (insightId === null || stepId === null || journeyId === null) {
    return null;
  }

  return (
    <PreparedDrawer
      title={insight?.title || "Insight details"}
      open={insightId !== null}
      onClose={() => setSearchParams({})}
    >
      <div className="p-4 flex flex-col gap-2">
        <span className="text-sm text-secondary-foreground font-medium block">
          Description
        </span>
        <p className="pb-8">{insight?.description}</p>
        <Button
          variant="destructive"
          onClick={() => mutate({ insightId, stepId })}
        >
          Remove insight
        </Button>
      </div>
    </PreparedDrawer>
  );
}
