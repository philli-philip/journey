import { API_BASE_URL } from "@shared/constants";

export async function uploadImage(
  file: File,
  stepId?: string,
  personaSlug?: string
): Promise<void> {
  const formData = new FormData();

  if (stepId) {
    formData.append("stepId", stepId);
  }
  if (personaSlug) {
    formData.append("personaSlug", personaSlug);
  }
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/images`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to upload image");
  }

  return response.json();
}

export async function deleteImage(imageId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete image");
  }

  return response.json();
}
