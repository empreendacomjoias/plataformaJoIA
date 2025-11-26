import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBanner() {
  const { activeNotifications } = useNotifications();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Load dismissed IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("dismissedNotifications");
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch {
        setDismissedIds([]);
      }
    }
  }, []);

  const visibleNotifications = activeNotifications.filter(
    (notification) => !dismissedIds.includes(notification.id)
  );

  const dismissNotification = (id: string) => {
    const newDismissedIds = [...dismissedIds, id];
    setDismissedIds(newDismissedIds);
    localStorage.setItem("dismissedNotifications", JSON.stringify(newDismissedIds));
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-md flex items-start justify-between gap-4"
        >
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{notification.title}</h3>
            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissNotification(notification.id)}
            className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}