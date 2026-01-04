import { API_BASE_URL } from "@shared/constants";
import type { updateJourneyDto } from "@shared/Dto/journey.types";

export async function fetchAllJourneys() {
  const response = await fetch(`${API_BASE_URL}/journeys`);
  if (!response.ok) {
    throw new Error("Failed to fetch journeys");
  }
  const data = await response.json();
  return data;
}

export async function createJourney() {
  const response = await fetch(`${API_BASE_URL}/journeys`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to create journey");
  }
  const data = await response.json();
  return data;
}

export async function fetchJourneyById(id: string) {
  const response = await fetch(`${API_BASE_URL}/journeys/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch journey with id ${id}`);
  }
  const data = await response.json();
  return data;
}

export async function updateJourney(data: updateJourneyDto) {
  const response = await fetch(`${API_BASE_URL}/journeys/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.updates),
  });
  if (!response.ok) {
    throw new Error(`Failed to update journey with id ${data.id}`);
  }
  return { id: data.id };
}
export async function deleteJourney(id: string) {
  const response = await fetch(`${API_BASE_URL}/journeys/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete journey with id ${id}`);
  }
  return { id, message: "Journey deleted successfully" };
}

export async function restoreJourney(id: string) {
  const response = await fetch(`${API_BASE_URL}/journeys/${id}/restore`, {
    method: "PUT",
  });
  if (!response.ok) {
    throw new Error(`Failed to restore journey with id ${id}`);
  }
  return response.json();
}
