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
          <Route path="/admin" element={<AdminChat />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/queue" element={<AdminQueue />} />
         
          <Route path="/admin/uploads" element={<Uploads />} />
          
          
        
          
          
          {/* Student routes */}
          <Route path="/student" element={<StudentChat />} />
          
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
