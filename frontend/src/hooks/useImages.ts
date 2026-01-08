import { deleteImage, uploadImage } from "@/api/images";
import { useMutation } from "@tanstack/react-query";

export const useImage = () => {
  const uploadImageMutation = useMutation({
    mutationFn: ({
      file,
      stepId,
      personaSlug,
    }: {
      file: File;
      stepId?: string;
      personaSlug?: string;
    }) => uploadImage(file, stepId, personaSlug),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => deleteImage(imageId),
  });

  return { uploadImageMutation, deleteImageMutation };
};
