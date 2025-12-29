import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import InsightList from "@/components/InsightList";
import { getColumns } from "@/components/insights-columns";

export default function InsightsPage() {
  const mockInsights = [
    {
      id: "1",
      title: "Insight 1: Users prefer dark mode",
      description: "Description for insight 1",
    },
    {
      id: "2",
      title: "Insight 2: High bounce rate on checkout page",
      description: "Description for insight 2",
    },
    {
      id: "3",
      title: "Insight 3: New feature X is popular",
      description: "Description for insight 3",
    },
  ];

  const columns = getColumns();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row p-1 items-center gap-2 border-b border-border">
        <Button asChild variant="ghost" size="icon">
          <SidebarTrigger />
        </Button>
        <h1 className="font-semibold flex-1">Insights</h1>
        <Button size="sm">
          New Insight
        </Button>
      </div>
      <InsightList columns={columns} data={mockInsights} />
    </div>
  );
}