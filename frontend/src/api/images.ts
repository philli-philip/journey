const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadImage(file: File, stepId: string): Promise<void> {
  const formData = new FormData();
  formData.append("stepId", stepId);
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
