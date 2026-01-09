import MarkdownEditor from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyValue,
  KeyValueAccordion,
  KeyValueList,
} from "@/components/ui/key-value";
import { useDebounce } from "@/hooks/useDebounce";
import { useImage } from "@/hooks/useImages";
import { useUpdatePersonaMutation, usePersonaQuery } from "@/hooks/usePersona";
import { formatDate } from "@/lib/formats";
import { imageURI } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Trash, UploadCloudIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function PersonaDetails() {
  const { slug } = useParams();
  const { data: persona } = usePersonaQuery(slug || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImageMutation, deleteImageMutation } = useImage();
  const updateUser = useUpdatePersonaMutation();
  const client = useQueryClient();
  const [open, setOpen] = useState(false);

  const [newTitle, setNewTitle] = useState(persona?.name || "");

  const handleTitleUpdate = async () => {
    if (!slug || !persona) return;
    updateUser.mutate(
      { slug: persona.slug, changes: { name: newTitle } },
      {
        onSuccess: () => {
          client.invalidateQueries({ queryKey: ["personas", persona.slug] });
        },
      }
    );
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleUpload = (files: FileList) => {
    if (files.length > 0) {
      uploadImageMutation.mutate(
        {
          file: files[0],
          personaSlug: persona?.slug,
        },
        {
          onSuccess: () =>
            client.invalidateQueries({ queryKey: ["personas", persona?.slug] }),
        }
      );
    }
  };

  const handleDelete = () => {
    if (persona && persona.imageId)
      deleteImageMutation.mutate(persona?.imageId, {
        onSuccess: () => {
          updateUser.mutate(
            {
              slug: persona.slug,
              changes: { imageId: null },
            },
            {
              onSuccess: () =>
                client.invalidateQueries({
                  queryKey: ["personas", persona.slug],
                }),
            }
          );
        },
      });
  };

  const { mutate } = useUpdatePersonaMutation();

  const debouncedHandleDescriptionChange = useCallback(
    (newDescription: string) => {
      if (slug) {
        mutate({
          slug: slug,
          changes: {
            description: newDescription,
          },
        });
      }
    },
    [slug, mutate]
  );

  const handleDescriptionChange = useDebounce(
    debouncedHandleDescriptionChange,
    3000
  );

  if (!persona) {
    return;
  }

  return (
    <div className="bg-neutral-100 w-full grow h-10 overflow-x-scroll pt-20">
      <div className="grow relative px-4 mx-auto max-w-4xl bg-card shadow-sm rounded-xl pt-24">
        <div className="size-32 bg-card rounded-full border shadow-sm -top-16 absolute z-10 flex flex-rol items-center justify-center">
          {persona.imageId ? (
            <div className="group relative">
              <Button
                className="hidden group-hover:flex absolute appearance-none size-8 top-0 right-0"
                variant="outline"
                onClick={handleDelete}
              >
                <Trash size="24" />
                <span className="sr-only">Delete image</span>
              </Button>
              <img
                src={imageURI(persona.imageId)}
                className="object-cover size-32 rounded-full"
              />
            </div>
          ) : (
            <Button size="icon-lg" variant="ghost" onClick={openFileBrowser}>
              <UploadCloudIcon size="24" />
            </Button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
        </div>
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleTitleUpdate}
          className="text-4xl font-bold pb-4 border-none h-auto tracking-tight shadow-none focus-within:ring-transparent"
        />
        <KeyValueList open={open}>
          <KeyValue
            label="Updated"
            permanent
            muted
            value={formatDate(new Date(persona.updatedAt))}
          />
          <KeyValue
            label="Created"
            muted
            value={formatDate(new Date(persona.createdAt))}
          />
        </KeyValueList>
        <KeyValueAccordion open={open} toggleFunction={() => setOpen(!open)} />
        <MarkdownEditor
          value={persona.description || ""}
          onChange={handleDescriptionChange}
          placeholder="Add a description for your persona..."
        />
      </div>
    </div>
  );
}
