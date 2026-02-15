import React from "react";
import { createHashRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import { RequireAuth } from "../features/auth/RequireAuth";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import ApplicationDetailsPage from "../pages/ApplicationDetailsPage";
import UsersPage from "../pages/UsersPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createHashRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      // Optional: handle /index.html if someone opens it
      { path: "/index.html", element: <Navigate to="/" replace /> },
      { path: "/", element: <Navigate to="/admin" replace /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "applications", element: <ApplicationsPage /> },
      { path: "applications/:id", element: <ApplicationDetailsPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
