import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { columns } from "@/components/user-journeys-columns";
import UserJourneyList from "@/components/userJourneyList";
import { fetchAllJourneys } from "@/api/journeys";
import { Empty, EmptyTitle } from "@/components/ui/empty";

export default function UserJourneys() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getJourneys() {
      try {
        const data = await fetchAllJourneys();
        setJourneys(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getJourneys();
  }, []);

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
      <UserJourneyList columns={columns} data={journeys} />
    </div>
  );
}
