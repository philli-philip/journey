const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchAllJourneys() {
  const response = await fetch(`${API_BASE_URL}/journeys`);
  if (!response.ok) {
    throw new Error("Failed to fetch journeys");
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

export async function updateJourney(
  id: string,
  updates: { name?: string; description?: string }
) {
  const response = await fetch(`${API_BASE_URL}/journeys/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error(`Failed to update journey with id ${id}`);
  }
  return response.json();
}
export async function deleteJourney(id: string) {
  const response = await fetch(`${API_BASE_URL}/journeys/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete journey with id ${id}`);
  }
  return response.json();
}
