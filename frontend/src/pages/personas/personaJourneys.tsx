import { Empty, EmptyContent, EmptyTitle } from "@/components/ui/empty";
import { useJourneyColumns } from "@/components/journey/user-journeys-columns";
import UserJourneyList from "@/components/journey/userJourneyList";
import useAllJourneys from "@/hooks/useAllJourneys";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PersonaJourneys() {
  const { slug } = useParams();
  const { journeys, loading, error, createJourney } = useAllJourneys({
    filter: { personaSlug: slug },
  });
  const columns = useJourneyColumns();

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <Empty title="Error loading journeys" />;
  }

  if (!journeys || !slug) {
    return <Empty title="No journey linked to this persona" />;
  }

  const Actions = () => (
    <Button size="sm" onClick={() => createJourney({ personaSlugs: [slug] })}>
      New journey
    </Button>
  );

  if (journeys.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No user journeys link to persona</EmptyTitle>
        <EmptyContent>
          <Actions />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <UserJourneyList columns={columns} data={journeys} actions={<Actions />} />
  );
}
