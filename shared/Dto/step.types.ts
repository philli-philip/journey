export interface updateStepDto {
  id: string;
  changes: {
    name?: string;
    description?: string;
    journeyId?: string;
    imageId?: string;
  };
}
