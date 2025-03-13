
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

// PrimeReact imports
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <PrimeReactProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
        <Toaster />
      </div>
    </PrimeReactProvider>
  );
};

export default App;
