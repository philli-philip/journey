export interface CreatePersonaDto {
  slug: string;
  name: string;
  description?: string;
}

export interface UpdatePersonaDto {
  slug: string;
  name?: string;
  description?: string;
}
