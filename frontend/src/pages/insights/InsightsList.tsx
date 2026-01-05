import InsightList from "@/components/insights/InsightList";
import { getColumns } from "@/components/insights/insights-columns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Insight } from "@shared/types";
import { getAllInsights } from "@/api/insights";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import CreateInsightDrawer from "@/components/insights/createInsightDrawer";
import { PageTitle } from "@/components/ui/page-title";
import { DetailHeader, HeaderTitle } from "@/components/layouts/blocks/header";

export default function InsightsPage() {
  const queryClient = useQueryClient();
  const columns = getColumns(queryClient);

  const { data, isLoading, error } = useQuery<Insight[]>({
    queryKey: ["insights"],
    queryFn: () => getAllInsights(),
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
    <>
      <PageTitle title="Insights" />
      <DetailHeader>
        <HeaderTitle className="flex-1">Insights</HeaderTitle>
        <CreateInsightDrawer />
      </DetailHeader>
      <InsightList columns={columns} data={data || []} />
    </>
  );
}
