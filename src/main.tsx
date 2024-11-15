import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Catalog, catalogRoutes } from '@/catalog';
import ErrorPage from './ErrorPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Catalog />,
    errorElement: <ErrorPage />,
  },
  ...catalogRoutes,
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
