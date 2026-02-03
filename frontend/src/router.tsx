import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, AppLayout } from "./components";
import {
  LoginPage,
  DashboardPage,
  ContactsListPage,
  ContactFormPage,
  ContactDetailPage,
  TagsPage,
  MeetingPlacesPage,
} from "./pages";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
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
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "contacts",
        element: <ContactsListPage />,
      },
      {
        path: "contacts/new",
        element: <ContactFormPage />,
      },
      {
        path: "contacts/:id",
        element: <ContactDetailPage />,
      },
      {
        path: "contacts/:id/edit",
        element: <ContactFormPage />,
      },
      {
        path: "tags",
        element: <TagsPage />,
      },
      {
        path: "meeting-places",
        element: <MeetingPlacesPage />,
      },
    ],
  },
]);
