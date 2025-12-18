import { fetchJourneyById } from "@/api/journeys";
import type { Journey } from "@/types/journey";
import { useEffect, useState } from "react";

export default function useJourney(journeyId: string) {
  const [journey, setJourney] = useState<Journey | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getJourney() {
      if (!journeyId) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchJourneyById(journeyId);
        setJourney({
          ...data,
          steps:
            typeof data.steps === "string"
              ? JSON.parse(data.steps)
              : data.steps,
        });

        console.log(journey);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getJourney();
  }, [journeyId]);

  return { journey, loading, error, setJourney };
}
