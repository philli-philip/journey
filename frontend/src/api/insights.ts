import type { Insight, InsightTypes } from "@shared/types";
import { API_BASE_URL } from "@shared/constants";
import type { updateInsightDto } from "@shared/Dto/insight.types";

export async function getAllInsights(filter?: { type?: InsightTypes }) {
  const response = await fetch(
    `${API_BASE_URL}/insights${filter?.type ? `?type=${filter.type}` : ""}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get insight");
  }

  return (await response.json()) as Insight[];
}

export async function linkInsightToStep({
  id,
  stepId,
  type,
}: {
  id: string;
  stepId: string;
  type: InsightTypes;
}) {
  const response = await fetch(`${API_BASE_URL}/connections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, attributeId: id, stepId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to link insight to step");
  }

  return response.json();
}

export async function getInsight(id: string): Promise<Insight | undefined> {
  const response = await fetch(`${API_BASE_URL}/insights/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
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
    return new Error(errorData.message || "Failed to create insight");
  }

  return (await response.json()) as Insight;
}

export async function updateInsight(insight: updateInsightDto) {
  const response = await fetch(`${API_BASE_URL}/insights/${insight.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(insight.updates),
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
