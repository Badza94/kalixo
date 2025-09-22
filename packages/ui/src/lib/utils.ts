import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

// Format currency for display
export const formatCurrency = (
  amount: number,
  currencyCode: string,
  locale?: string
): string => {
  let loc = locale;

  switch (locale) {
    case "en":
      loc = "en-GB";
      break;
    case "it":
      loc = "it-IT";
      break;
    default:
      loc = "en-GB";
      break;
  }

  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
