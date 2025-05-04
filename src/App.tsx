
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import RoadsPage from "./pages/RoadsPage";
import InfraPage from "./pages/InfraPage";
import RoadDetailPage from "./pages/RoadDetailPage";
import NotFound from "./pages/NotFound";
import { RoadProvider } from "./contexts/RoadContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoadProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="roads" element={<RoadsPage />} />
              <Route path="roads/:id" element={<RoadDetailPage />} />
              <Route path="infra" element={<InfraPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RoadProvider>
  </QueryClientProvider>
);

export default App;
