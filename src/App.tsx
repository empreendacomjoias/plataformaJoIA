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
import NotFound from "./pages/NotFound";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
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
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/club-joia" element={<ClubJoia />} />
                <Route path="/club-joia/admin" element={<AdminRoute><ClubJoiaAdmin /></AdminRoute>} />
                <Route path="/joia-indica" element={<JoiaIndica />} />
                <Route path="/joia-indica/admin" element={<AdminRoute><JoiaIndicaAdmin /></AdminRoute>} />
                <Route path="/adicionar" element={<AdminRoute><AddSupplier /></AdminRoute>} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
