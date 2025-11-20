import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Sidebar } from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Ranking from "./pages/Ranking";
import JoiaIndica from "./pages/JoiaIndica";
import JoiaIndicaAdmin from "./pages/JoiaIndicaAdmin";
import ClubJoia from "./pages/ClubJoia";
import ClubJoiaAdmin from "./pages/ClubJoiaAdmin";
import AddSupplier from "./pages/AddSupplier";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <div className="flex min-h-screen w-full bg-background">
                  <Sidebar />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/favoritos" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                      <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
                      <Route path="/club-joia" element={<ProtectedRoute><ClubJoia /></ProtectedRoute>} />
                      <Route path="/club-joia/admin" element={<ProtectedRoute adminOnly><ClubJoiaAdmin /></ProtectedRoute>} />
                      <Route path="/joia-indica" element={<ProtectedRoute><JoiaIndica /></ProtectedRoute>} />
                      <Route path="/joia-indica/admin" element={<ProtectedRoute adminOnly><JoiaIndicaAdmin /></ProtectedRoute>} />
                      <Route path="/adicionar" element={<ProtectedRoute adminOnly><AddSupplier /></ProtectedRoute>} />
                      <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
