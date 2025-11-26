import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_by: string | null;
  created_at: string;
  is_active: boolean;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const { data: activeNotifications = [] } = useQuery({
    queryKey: ["active-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const createNotification = useMutation({
    mutationFn: async (notification: { title: string; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          title: notification.title,
          message: notification.message,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["active-notifications"] });
      toast.success("Notificação enviada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao enviar notificação");
      console.error(error);
    },
  });

  const toggleNotificationStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["active-notifications"] });
      toast.success("Status atualizado!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status");
      console.error(error);
    },
  });

  const updateNotification = useMutation({
    mutationFn: async ({ id, title, message }: { id: string; title: string; message: string }) => {
      const { error } = await supabase
        .from("notifications")
        .update({ title, message })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["active-notifications"] });
      toast.success("Notificação atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar notificação");
      console.error(error);
    },
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["active-notifications"] });
      toast.success("Notificação excluída!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir notificação");
      console.error(error);
    },
  });

  return {
    notifications,
    activeNotifications,
    isLoading,
    createNotification,
    updateNotification,
    toggleNotificationStatus,
    deleteNotification,
  };
};