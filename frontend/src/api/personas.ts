import type {
  CreatePersonaDto,
  UpdatePersonaDto,
} from "@shared/Dto/persona.types";
import type { Persona } from "@shared/types";
import { API_BASE_URL } from "@shared/constants";

export async function getPersonas() {
  const response = await fetch(`${API_BASE_URL}/personas`);
  try {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch personas");
    }
    const personas: Persona[] = await response.json();
    return personas;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error while processing the response"
    );
  }
}

export async function getPersona(slug: string) {
  const response = await fetch(`${API_BASE_URL}/personas/${slug}`);
  try {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch persona");
    }
    const persona: Persona = await response.json();
    return persona;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error while processing the response"
    );
  }
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
    const data: { message: string; slug: string } = await response.json();
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
