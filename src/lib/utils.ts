import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const monthMap: { [key: string]: number } = {
  'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
  'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
};

export function parsePtBrDate(dateString: string): Date {
  const parts = dateString.toLowerCase().split(' de ');
  if (parts.length < 3) return new Date(0);
  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1]];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return new Date(0);
  return new Date(year, month, day);
}
