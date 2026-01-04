export interface updateJourneyDto {
  id: string;
  updates: {
    name?: string;
    description?: string;
    personaSlugs?: string[];
    orderedStepIds?: string[];
  };
}
