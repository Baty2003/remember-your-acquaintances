import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  LoginPage,
  DashboardPage,
  ContactsListPage,
  ContactFormPage,
  ContactDetailPage,
} from './pages';
import { ProtectedRoute, AppLayout } from './components';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/contacts" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'contacts',
        element: <ContactsListPage />,
      },
      {
        path: 'contacts/new',
        element: <ContactFormPage />,
      },
      {
        path: 'contacts/:id',
        element: <ContactDetailPage />,
      },
      {
        path: 'contacts/:id/edit',
        element: <ContactFormPage />,
      },
    ],
  },
]);
