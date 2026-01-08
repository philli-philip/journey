import { API_BASE_URL } from "@shared/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageURI(imageId: string) {
  return `${API_BASE_URL}/images/${imageId}`;
}
