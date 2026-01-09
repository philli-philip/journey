import type {
  CreatePersonaDto,
  UpdatePersonaDto,
} from "@shared/Dto/persona.types";
import type { Persona } from "@shared/types";
import { API_BASE_URL } from "@shared/constants";

export async function getPersonas() {
  const response = await fetch(`${API_BASE_URL}/personas`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return (await response.json()) as Persona[];
}

export async function getPersona(slug: string) {
  const response = await fetch(`${API_BASE_URL}/personas/${slug}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return (await response.json()) as Persona;
}

export async function createPersona(persona: CreatePersonaDto) {
  const response = await fetch(`${API_BASE_URL}/personas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(persona),
  });
  try {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create persona");
    }
    const createdPersona: Persona = await response.json();
    return createdPersona;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error while processing the response"
    );
  }
}

export async function deletePersona(id: string) {
  const response = await fetch(`${API_BASE_URL}/personas/${id}`, {
    method: "DELETE",
  });
  try {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete persona");
    }
    const data = (await response.json()) as Persona;
    return data.slug;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error while processing the response"
    );
  }
}

export async function updatePersona(persona: UpdatePersonaDto) {
  const response = await fetch(`${API_BASE_URL}/personas`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(persona),
  });
  try {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update persona");
    }
    const updatedPersona: Persona = await response.json();
    return updatedPersona;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error while processing the response"
    );
  }
}
export async function restorePersona(slug: string) {
  const response = await fetch(`${API_BASE_URL}/personas/${slug}/restore`, {
    method: "PUT",
  });
  try {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to restore persona");
    }
    const persona = await response.json();
    return persona as Persona;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error while processing the response"
    );
  }
}
