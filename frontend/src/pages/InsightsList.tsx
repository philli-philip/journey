import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import InsightList from "@/components/InsightList";
import { getColumns } from "@/components/insights-columns";
import { useQuery } from "@tanstack/react-query";
import type { Insight } from "@shared/types";
import { getAllInsights } from "@/api/insights";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import CreateInsightDrawer from "@/components/insights/createInsightDrawer";

export default function InsightsPage() {
  const columns = getColumns();

  const { data, isLoading, error } = useQuery<Insight[]>({
    queryKey: ["insights"],
    queryFn: getAllInsights,
  });

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  if (error) {
    return (
      <Empty>
        <EmptyTitle>Error loading insights.</EmptyTitle>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row p-1 items-center gap-2 border-b border-border">
        <Button asChild variant="ghost" size="icon">
          <SidebarTrigger />
        </Button>
        <h1 className="font-semibold flex-1">Insights</h1>
        <CreateInsightDrawer />
      </div>
      <InsightList columns={columns} data={data || []} />
    </div>
  );
}
