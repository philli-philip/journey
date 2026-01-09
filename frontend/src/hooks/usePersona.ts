import {
  createPersona,
  deletePersona,
  getPersona,
  getPersonas,
  restorePersona,
  updatePersona,
} from "@/api/personas";
import type {
  CreatePersonaDto,
  UpdatePersonaDto,
} from "@shared/Dto/persona.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePersonaQuery = (slug: string) => {
  return useQuery({
    queryKey: ["personas", slug],
    queryFn: () => getPersona(slug),
    enabled: !!slug,
  });
};

export const useAllPersonaQuery = () => {
  return useQuery({
    queryKey: ["personas"],
    queryFn: () => getPersonas(),
  });
};

export const useCreatePersonaMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePersonaDto) => createPersona(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["personas"] });
    },
    onError: (error) => {
      console.error("Error creating persona:", error);
    },
  });
};

export const useDeletePersonaMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deletePersona(slug),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["personas"] });
    },
    onError: (error) => {
      console.error("Error deleting persona:", error);
    },
  });
};

export const useUpdatePersonaMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePersonaDto) => updatePersona(data),
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["personas", data.slug] });
    },
    onError: (error) => {
      console.error("Error updating persona:", error);
    },
  });
};

export const useRestorePersonaMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => restorePersona(slug),
    onSuccess: () => client.invalidateQueries({ queryKey: ["personas"] }),
    onError: (error) => {
      toast.error("Error restoring persona");
      console.log(error.message);
    },
  });
};
