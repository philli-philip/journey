import MarkdownEditor from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useImage } from "@/hooks/useImages";
import { useUpdatePersonaMutation, usePersonaQuery } from "@/hooks/usePersona";
import { imageURI } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash, UploadCloudIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function PersonaDetails() {
  const { slug } = useParams();
  const { data: persona } = usePersonaQuery(slug || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImageMutation, deleteImageMutation } = useImage();
  const updateUser = useUpdatePersonaMutation();
  const client = useQueryClient();

  const [isTitleEditing, setTitleEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(persona?.name || "");

  const handleTitleUpdate = async () => {
    if (!slug || !persona) return;
    updateUser.mutate(
      { slug: persona.slug, changes: { name: newTitle } },
      {
        onSuccess: () => {
          setTitleEditing(false);
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
    <div className="bg-neutral-100 w-full grow h-10 overflow-x-scroll">
      <div className="grow h-10 px-4 mx-auto max-w-4xl relative">
        <div className="flex flex-row gap-8 items-center py-12">
          <div className="size-32 bg-card rounded-full border shadow-sm ml-0 xl:-ml-4 z-10 flex flex-rol items-center justify-center">
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
          {isTitleEditing ? (
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleUpdate();
                }
              }}
              className="text-4xl min-w-[24ch] w-[80%] px-2 py-1 font-bold bg-stone-100 border-none focus-visible:outline-4 outline-4 ring-1 focus-visible:ring-1 ring-orange-400/50 rounded-sm outline-orange-700/10 tracking-tight appearance-none m-0 shadow-none"
            />
          ) : (
            <button
              onClick={() => {
                setTitleEditing(true);
                setNewTitle(persona.name);
              }}
              className="cursor-pointer rounded-md hover:bg-stone-200 px-2 py-1 block"
            >
              <h2 className="text-4xl tracking-tight font-bold flex flex-row gap-4 items-center">
                {persona.name}
                <Edit size="24" className="text-muted-foreground" />
              </h2>
            </button>
          )}
        </div>
        <MarkdownEditor
          value={persona.description || ""}
          onChange={handleDescriptionChange}
          className="p-0 w-full bg-card rounded-md shadow-sm pb-32"
          placeholder="Add a description for your persona..."
        />
      </div>
    </div>
  );
}
