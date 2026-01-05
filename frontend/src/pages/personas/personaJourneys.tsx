import { Empty } from "@/components/ui/empty";
import { useJourneyColumns } from "@/components/user-journeys-columns";
import UserJourneyList from "@/components/userJourneyList";
import useAllJourneys from "@/hooks/useAllJourneys";
import { useParams } from "react-router-dom";

export default function PersonaJourneys() {
  const { slug } = useParams();
  const { journeys, loading, error } = useAllJourneys({
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

  return <UserJourneyList columns={columns} data={journeys} />;
}
