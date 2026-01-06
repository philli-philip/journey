import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useJourneyColumns } from "@/components/journey/user-journeys-columns";
import UserJourneyList from "@/components/journey/userJourneyList";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import useAllJourneys from "@/hooks/useAllJourneys";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "@/components/ui/page-title";

export default function UserJourneys() {
  const { journeys, loading, error, createJourney } = useAllJourneys({
    filter: {},
  });
  const navigate = useNavigate();
  const columns = useJourneyColumns();

  const handleCreateJourney = async () => {
    const newJourney = await createJourney();
    if (newJourney && newJourney.id) {
      navigate(`/journey/${newJourney.id}/overview`);
    }
  };

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
      <PageTitle title="Journeys" />
      <div className="flex flex-row p-1 items-center gap-2 border-b border-border">
        <Button asChild variant="ghost" size="icon">
          <SidebarTrigger />
        </Button>
        <h1 className="font-semibold flex-1">Journeys</h1>
        <Button onClick={handleCreateJourney} size="sm">
          New Journey
        </Button>
      </div>
      <UserJourneyList columns={columns} data={journeys || []} />
    </div>
  );
}
