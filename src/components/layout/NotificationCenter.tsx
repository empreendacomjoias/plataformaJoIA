import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationCenter() {
  const { activeNotifications } = useNotifications();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Load dismissed and viewed IDs from localStorage
  useEffect(() => {
    const storedDismissed = localStorage.getItem("dismissedNotifications");
    const storedViewed = localStorage.getItem("viewedNotifications");
    
    if (storedDismissed) {
      try {
        setDismissedIds(JSON.parse(storedDismissed));
      } catch {
        setDismissedIds([]);
      }
    }
    
    if (storedViewed) {
      try {
        setViewedIds(JSON.parse(storedViewed));
      } catch {
        setViewedIds([]);
      }
    }
  }, []);

  const visibleNotifications = activeNotifications.filter(
    (notification) => !dismissedIds.includes(notification.id)
  );

  const unviewedCount = visibleNotifications.filter(
    (notification) => !viewedIds.includes(notification.id)
  ).length;

  const dismissNotification = (id: string) => {
    const newDismissedIds = [...dismissedIds, id];
    setDismissedIds(newDismissedIds);
    localStorage.setItem("dismissedNotifications", JSON.stringify(newDismissedIds));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    // Mark all visible notifications as viewed when opening
    if (newOpen && visibleNotifications.length > 0) {
      const allVisibleIds = visibleNotifications.map(n => n.id);
      const newViewedIds = [...new Set([...viewedIds, ...allVisibleIds])];
      setViewedIds(newViewedIds);
      localStorage.setItem("viewedNotifications", JSON.stringify(newViewedIds));
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {unviewedCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unviewedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notificações</h3>
          {visibleNotifications.length > 0 && (
            <Badge variant="secondary">{visibleNotifications.length}</Badge>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {visibleNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y">
              {visibleNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
