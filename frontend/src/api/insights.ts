import type { Insight } from "@shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllInsights() {
  const response = await fetch(`${API_BASE_URL}/insights`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get insight");
  }

  return response.json();
}

export async function getInsight(id: string): Promise<Insight | undefined> {
  const response = await fetch(`${API_BASE_URL}/insights/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get insight");
  }

  return response.json();
}

export async function createInsight(form: {
  title: string;
  type: string;
  description: string;
}) {
  const response = await fetch(`${API_BASE_URL}/insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create insight");
  }

  return response.json();
}

export async function updateInsight(
  insightId: string,
  insightData: {
    title: string;
    type: string;
    description: string;
  }
) {
  const response = await fetch(`${API_BASE_URL}/insights/${insightId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(insightData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update insight");
  }

  return response.json();
}

export async function deleteInsight(insightId: string) {
  const response = await fetch(`${API_BASE_URL}/insights/${insightId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete insight");
  }
  return response.json();
}
