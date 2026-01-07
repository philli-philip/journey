import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage, deleteImage } from "../../api/images";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import type { InsightTypes } from "@shared/types";
import { Link, useSearchParams } from "react-router-dom";
import { InsightIcon } from "../insights/insight-icons";
import { API_BASE_URL } from "@shared/constants";

export function ImageCell({
  imageId,
  stepId,
}: {
  imageId?: string;
  stepId: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const queryClient = useQueryClient();

  const uploadImageMutation = useMutation({
    mutationFn: ({ file, stepId }: { file: File; stepId: string }) =>
      uploadImage(file, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journey"],
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey"] });
    },
  });

  const handleUpload = (files: FileList) => {
    if (files.length > 0) {
      uploadImageMutation.mutate({ file: files[0], stepId });
    }
  };

  const handleDelete = (imageId: string) => {
    deleteImageMutation.mutate(imageId);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative flex flex-1 justify-center rounded-lg m-1 transition-all duration-200 ease-in-out",

        isDragging
          ? "border-blue-500 bg-blue-100"
          : "border-gray-300 hover:border-gray-400"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {imageId ? (
        <div className="relative group aspect-video w-full items-center flex flex-col">
          <img
            src={`${API_BASE_URL}/images/${imageId}`}
            alt={""}
            className="object-contain max-h-full border rounded-sm"
          />
          <Button
            onClick={() => handleDelete(imageId)}
            variant="outline"
            size="icon-sm"
            className="absolute top-2 right-2 hidden group-hover:flex"
          >
            <span className="sr-only">Delete image</span>
            <Trash size="16" />
          </Button>
        </div>
      ) : (
        <>
          {isDragging ? (
            <p className="text-gray-500 flex items-center">Drop Image Here</p>
          ) : (
            <div className="border-2 border-dashed rounded-lg justify-center hidden text-center group-hover:flex flex-col flex-1">
              <p className="text-gray-500">Click to upload or drag and drop</p>
              <button
                onClick={openFileBrowser}
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer focus:outline-none"
              >
                Browse Files
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
        </>
      )}
    </div>
  );
}

export function InsightCell({
  stepId,
  type,
  items,
}: {
  stepId: string;
  type: InsightTypes;
  items: { id: string; title: string }[];
}) {
  const [, setSearchParams] = useSearchParams();
  return (
    <div
      className={cn(
        "relative group flex flex-col flex-1 justify-start rounded-lg transition-all duration-200 ease-in-out"
      )}
    >
      {items.length > 0 ? (
        <div className="flex flex-col gap-0.5 p-1 pr-2">
          {items.map((insight) => (
            <Link
              to={`?insight=${insight.id}&step=${stepId}`}
              key={insight.id}
              className="border flex flex-row rounded-sm gap-2 px-2 py-1 hover:bg-gray-100"
            >
              <InsightIcon type={type} size="16" className="mt-1" />
              <span className="flex-1">{insight.title}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 hidden group-hover:flex items-center justify-center flex-1">
          No {type} yet
        </p>
      )}
      <Button
        variant="outline"
        size="icon-sm"
        className="opacity-0 group-hover:opacity-100 absolute top-1 right-1"
        onClick={() =>
          setSearchParams({ action: "add-insight", type, id: stepId })
        }
      >
        <span className="sr-only">Add Insight</span>
        <Plus size="16" />
      </Button>
    </div>
  );
}
