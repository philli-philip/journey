const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Update step function
 *  @param id is the step ID to be updated
 *  @param object is the new step data. always provide the full step object
 */

export async function updateStep(
  journeyId: string,
  stepId: string,
  stepData: {
    name?: string;
    description?: string;
    attributes?: {
      insights?: string;
      painPoints?: string;
      services?: string;
    };
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/journeys/${journeyId}/steps/${stepId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stepData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update step");
  }

  return response.json();
}

export async function createStep(journeyID: string) {
  const response = await fetch(`${API_BASE_URL}/journeys/${journeyID}/steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}), // Sending an empty object for now, can be extended later
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create step");
  }

  return response.json();
}

export async function deleteStep(stepId: string) {
  const response = await fetch(`${API_BASE_URL}/steps/${stepId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create step");
  }
  const data = response.json();
  return data;
}

export async function deleteInsightConnection(
  stepId: string,
  insightId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/steps/${stepId}/insights/${insightId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete insight connection");
  }

  return response.json();
}
