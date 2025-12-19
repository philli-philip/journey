import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { columns } from "@/components/user-journeys-columns";
import UserJourneyList from "@/components/userJourneyList";
import { fetchAllJourneys } from "@/api/journeys";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import { useQuery } from "@tanstack/react-query";
import { type UserJourney } from "@shared/types";

export default function UserJourneys() {
  const { data: journeys, isLoading: loading, error } = useQuery<UserJourney[]>(
    {
      queryKey: ["journeys"],
      queryFn: fetchAllJourneys,
    }
  );

  if (loading) {
    return <div>Loading journeys...</div>;
  }

  if (error) {
    return (
      <Empty>
        <EmptyTitle>Error loading journeys.</EmptyTitle>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row p-1 items-center gap-2 border-b border-border">
        <Button asChild variant="ghost" size="icon">
          <SidebarTrigger />
        </Button>
        <h1 className="font-semibold">User Journeys</h1>
      </div>
      <UserJourneyList columns={columns} data={journeys || []} />
    </div>
  );
}
