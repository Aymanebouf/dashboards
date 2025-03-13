
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// PrimeReact imports
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";    // theme
import "primereact/resources/primereact.min.css";                    // core css
import "primeicons/primeicons.css";                                  // icons
import "primeflex/primeflex.css";                                    // primeflex

// Toast providers
import { Toast } from 'primereact/toast';

// Pages
import Dashboard from "./pages/Dashboard";
import PrimeDashboardExample from "./pages/PrimeDashboardExample";
import AIPredictions from "./pages/AIPredictions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <div className={theme}>
          <Toast position="top-right" />
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} onToggleTheme={toggleTheme} />} />
            <Route path="/prime" element={<PrimeDashboardExample />} />
            <Route path="/ai-predictions" element={<AIPredictions />} />
            {/* Redirect /infos-engins to the dashboard page */}
            <Route path="/infos-engins" element={<Navigate to="/" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
};

export default App;
