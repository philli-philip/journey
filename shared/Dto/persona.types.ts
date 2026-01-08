export interface CreatePersonaDto {
  slug: string;
  name: string;
  description?: string;
}

export interface UpdatePersonaDto {
  slug: string;
  changes: {
    name?: string;
    description?: string;
    imageId?: string | null;
  };
}
