import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";

export function ImageCell({ img, stepId }: { img?: string; stepId: string }) {
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

  const handleUpload = (files: FileList) => {
    console.log("Files to upload:", files);
    // For now, just print to the terminal.
    // In a real application, you would handle the file upload here.
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
        "relative flex flex-1 justify-center rounded-lg transition-all duration-200 ease-in-out",

        isDragging
          ? "border-blue-500 bg-blue-100"
          : "border-gray-300 hover:border-gray-400"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {img ? (
        <img
          src={img}
          alt=""
          className="object-cover w-full h-full absolute inset-0"
        />
      ) : (
        <>
          {isDragging ? (
            <p className="text-gray-500 flex items-center">Drop Image Here</p>
          ) : (
            <div className="border-2 border-dashed m-2 rounded-lg justify-center hidden text-center group-hover:flex flex-col flex-1">
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
