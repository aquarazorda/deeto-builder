import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  try {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch (e) {
    toast.error("Failed to copy to clipboard");
  }
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function getQueryParam(paramName: string, searchString?: string) {
  const queryString = searchString || window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(paramName);
}
