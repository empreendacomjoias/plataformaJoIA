import { Category } from "@/types/category";

// Fallback colors for categories not yet in the database
const fallbackColorPalette = [
  { bg: "bg-violet-500/20", text: "text-violet-700 dark:text-violet-300", border: "border-violet-500/50 dark:border-violet-500/30" },
  { bg: "bg-indigo-500/20", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-500/50 dark:border-indigo-500/30" },
  { bg: "bg-sky-500/20", text: "text-sky-700 dark:text-sky-300", border: "border-sky-500/50 dark:border-sky-500/30" },
  { bg: "bg-teal-500/20", text: "text-teal-700 dark:text-teal-300", border: "border-teal-500/50 dark:border-teal-500/30" },
  { bg: "bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-500/50 dark:border-emerald-500/30" },
  { bg: "bg-lime-500/20", text: "text-lime-700 dark:text-lime-300", border: "border-lime-500/50 dark:border-lime-500/30" },
  { bg: "bg-orange-500/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500/50 dark:border-orange-500/30" },
  { bg: "bg-red-500/20", text: "text-red-700 dark:text-red-300", border: "border-red-500/50 dark:border-red-500/30" },
  { bg: "bg-rose-500/20", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/50 dark:border-rose-500/30" },
  { bg: "bg-fuchsia-500/20", text: "text-fuchsia-700 dark:text-fuchsia-300", border: "border-fuchsia-500/50 dark:border-fuchsia-500/30" },
];

// Get inline styles for a category based on database color
export function getCategoryStyle(categoryName: string, categories: Category[]) {
  const category = categories.find(c => c.name === categoryName);
  
  if (category?.color) {
    return {
      backgroundColor: `${category.color}20`,
      borderColor: `${category.color}50`,
      color: category.color,
    };
  }
  
  // Fallback: use hash-based color from palette
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallback = fallbackColorPalette[hash % fallbackColorPalette.length];
  return null; // Will use Tailwind classes instead
}

// Get Tailwind classes for fallback (when category not in database)
export function getCategoryFallbackClasses(categoryName: string): string {
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallback = fallbackColorPalette[hash % fallbackColorPalette.length];
  return `${fallback.bg} ${fallback.text} ${fallback.border}`;
}
