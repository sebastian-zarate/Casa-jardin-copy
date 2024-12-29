import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// por ahora solo se usa para /components/ui/custom-tabs.tsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}