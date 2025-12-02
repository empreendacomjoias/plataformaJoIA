import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bell, Plus, Trash2, Pencil } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function NotificationsAdmin() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const {
    notifications,
    isLoading,
    createNotification,
    updateNotification,
    toggleNotificationStatus,
    deleteNotification,
  } = useNotifications();

  const openEditDialog = (notification: Notification) => {
    setEditingNotification(notification);
    setTitle(notification.title);
    setMessage(notification.message);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingNotification(null);
    setTitle("");
    setMessage("");
    setIsEditDialogOpen(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      return;
    }

    createNotification.mutate(
      { title, message },
      {
        onSuccess: () => {
          setTitle("");
          setMessage("");
          setIsCreateDialogOpen(false);
        },
      }
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim() || !editingNotification) {
      return;
    }

    updateNotification.mutate(
      { id: editingNotification.id, title, message },
      {
        onSuccess: () => {
          closeEditDialog();
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
            Gerenciar Notificações
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Envie notificações para todos os usuários da plataforma
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Notificação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Notificação</DialogTitle>
              <DialogDescription>
                Esta notificação será exibida para todos os usuários
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="create-title">Título</Label>
                <Input
                  id="create-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                  placeholder="Digite o título da notificação"
                  required
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
              </div>
              <div>
                <Label htmlFor="create-message">Mensagem</Label>
                <Textarea
                  id="create-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  placeholder="Digite a mensagem da notificação"
                  rows={4}
                  required
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">{message.length}/500</p>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createNotification.isPending}
              >
                {createNotification.isPending ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Notificação</DialogTitle>
            <DialogDescription>
              Atualize o título e a mensagem da notificação
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="Digite o título da notificação"
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
            </div>
            <div>
              <Label htmlFor="edit-message">Mensagem</Label>
              <Textarea
                id="edit-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Digite a mensagem da notificação"
                rows={4}
                required
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">{message.length}/500</p>
            </div>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={closeEditDialog}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={updateNotification.isPending}
              >
                {updateNotification.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Notificações Enviadas</CardTitle>
          <CardDescription>
            Gerencie todas as notificações da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhuma notificação criada ainda
            </p>
          ) : (
            <>
              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Título</th>
                      <th className="text-left p-4 font-medium">Mensagem</th>
                      <th className="text-left p-4 font-medium">Data</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification) => (
                      <tr key={notification.id} className="border-b">
                        <td className="p-4 font-medium">{notification.title}</td>
                        <td className="p-4 max-w-md truncate">{notification.message}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={notification.is_active}
                              onCheckedChange={(checked) =>
                                toggleNotificationStatus.mutate({
                                  id: notification.id,
                                  is_active: checked,
                                })
                              }
                            />
                            <span className="text-sm">
                              {notification.is_active ? "Ativa" : "Inativa"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(notification)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteNotification.mutate(notification.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                        <Badge variant={notification.is_active ? "default" : "secondary"}>
                          {notification.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={notification.is_active}
                            onCheckedChange={(checked) =>
                              toggleNotificationStatus.mutate({
                                id: notification.id,
                                is_active: checked,
                              })
                            }
                          />
                          <span className="text-xs text-muted-foreground">
                            {notification.is_active ? "Ativa" : "Inativa"}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(notification)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteNotification.mutate(notification.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}