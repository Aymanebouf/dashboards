
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";

// PrimeReact imports
import "primereact/resources/themes/lara-light-indigo/theme.css";    // theme
import "primereact/resources/primereact.min.css";                    // core css
import "primeicons/primeicons.css";                                  // icons
import "primeflex/primeflex.css";                                    // primeflex

import Dashboard from "./pages/Dashboard";
import PrimeDashboardExample from "./pages/PrimeDashboardExample";
import AIPredictions from "./pages/AIPredictions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prime" element={<PrimeDashboardExample />} />
          <Route path="/ai-predictions" element={<AIPredictions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
