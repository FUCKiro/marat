import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { AuthProvider } from './contexts/AuthContext';
import ChiSiamo from './pages/ChiSiamo.tsx';
import CosaFacciamo from './pages/CosaFacciamo.tsx';
import Team from './pages/Team.tsx';
import Contatti from './pages/Contatti.tsx';
import Privacy from './pages/Privacy.tsx';
import Layout from './components/Layout.tsx';
import './index.css';

const Root = () => {
  return (
    <AuthProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <App /> },
      { path: '/login', element: <Login /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/chi-siamo', element: <ChiSiamo /> },
      { path: '/cosa-facciamo', element: <CosaFacciamo /> },
      { path: '/team', element: <Team /> },
      { path: '/contatti', element: <Contatti /> },
      { path: '/privacy', element: <Privacy /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);