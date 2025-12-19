import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getColumns } from "@/components/user-journeys-columns";
import UserJourneyList from "@/components/userJourneyList";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import useAllJourneys from "@/hooks/useAllJourneys";
import useJourney from "@/hooks/useJourney"; // Import useJourney to get mutations
import { useNavigate } from "react-router-dom";

export default function UserJourneys() {
  const { journeys, loading, error, createJourney } = useAllJourneys();
  const { deleteJourney } = useJourney(""); // Pass an empty string or a dummy ID, as we only need the mutations here
  const navigate = useNavigate();

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

  const columns = getColumns({ deleteJourney });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row p-1 items-center gap-2 border-b border-border">
        <Button asChild variant="ghost" size="icon">
          <SidebarTrigger />
        </Button>
        <h1 className="font-semibold flex-1">User Journeys</h1>
        <Button onClick={handleCreateJourney} size="sm">
          New Journey
        </Button>
      </div>
      <UserJourneyList columns={columns} data={journeys || []} />
    </div>
  );
}
