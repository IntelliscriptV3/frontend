import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminChat from "./pages/admin/AdminChat";
import Settings from "./pages/admin/Settings";
import AdminQueue from "./pages/admin/AdminQueue";
import RequireRole from "./components/RequireRole";

import Uploads from "./pages/admin/Uploads";




// Student pages
import StudentChat from "./pages/student/StudentChat";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<RequireRole allowed="admin"><AdminChat /></RequireRole>} />
          <Route path="/admin/settings" element={<RequireRole allowed="admin"><Settings /></RequireRole>} />
          <Route path="/admin/queue" element={<RequireRole allowed="admin"><AdminQueue /></RequireRole>} />

          <Route path="/admin/uploads" element={<RequireRole allowed="admin"><Uploads /></RequireRole>} />
          
          
        
          
          
          {/* Student routes */}
          <Route path="/student" element={<RequireRole allowed="student"><StudentChat /></RequireRole>} />
          
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
