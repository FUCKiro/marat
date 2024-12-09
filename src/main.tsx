import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import ChiSiamo from './pages/ChiSiamo.tsx';
import CosaFacciamo from './pages/CosaFacciamo.tsx';
import Team from './pages/Team.tsx';
import Contatti from './pages/Contatti.tsx';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/chi-siamo', element: <ChiSiamo /> },
  { path: '/cosa-facciamo', element: <CosaFacciamo /> },
  { path: '/team', element: <Team /> },
  { path: '/contatti', element: <Contatti /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
