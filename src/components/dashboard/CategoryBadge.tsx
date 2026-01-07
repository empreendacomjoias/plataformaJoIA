import { Badge } from "@/components/ui/badge";
import { useCategoriesWithColors } from "@/hooks/useCategoriesWithColors";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const fallbackColorPalette = [
  "bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/50 dark:border-violet-500/30",
  "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/50 dark:border-indigo-500/30",
  "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/50 dark:border-sky-500/30",
  "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/50 dark:border-teal-500/30",
  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 dark:border-emerald-500/30",
  "bg-lime-500/20 text-lime-700 dark:text-lime-300 border-lime-500/50 dark:border-lime-500/30",
  "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/50 dark:border-orange-500/30",
  "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/50 dark:border-red-500/30",
  "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50 dark:border-rose-500/30",
  "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/50 dark:border-fuchsia-500/30",
];

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const { categories } = useCategoriesWithColors();
  
  const categoryData = categories.find(c => c.name === category);
  
  if (categoryData?.color) {
    return (
      <Badge
        variant="outline"
        className={cn("text-xs border", className)}
        style={{
          backgroundColor: `${categoryData.color}20`,
          borderColor: `${categoryData.color}50`,
          color: categoryData.color,
        }}
      >
        {category}
      </Badge>
    );
  }
  
  // Fallback for categories not in database
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackClass = fallbackColorPalette[hash % fallbackColorPalette.length];
  
  return (
    <Badge
      variant="outline"
      className={cn("text-xs border", fallbackClass, className)}
    >
      {category}
    </Badge>
  );
}
