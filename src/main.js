
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/dashboard.css';

// PrimeReact imports
import "primereact/resources/themes/lara-light-indigo/theme.css";    // theme
import "primereact/resources/primereact.min.css";                    // core css
import "primeicons/primeicons.css";                                  // icons
import "primeflex/primeflex.css";                                    // primeflex

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
