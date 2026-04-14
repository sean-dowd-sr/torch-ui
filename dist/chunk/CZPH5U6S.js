import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// src/utilities/classNames.ts
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export { cn };
