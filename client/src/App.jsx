// App.jsx
import React from "react";
import guitarDb from "@tombatossals/chords-db/lib/guitar.json";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import UploadPage from "./pages/UploadPage";
import { InstrumentProvider } from "./context/InstrumentContext";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SubmissionManagement from "./pages/admin/SubmissionManagement";
import SongManagement from "./pages/admin/SongManagement";
import UserManagement from "./pages/admin/UserManagement";
import PasswordReset from "./pages/PasswordReset";

function App() {
  const router = createBrowserRouter([
    {
      element: <AuthProvider children={<Outlet />} />,
      children: [
        {
          path: "/",
          element: <MainLayout />,
            children: [
              { index: true, element: <Home /> },
              { path: "search", element: <SearchPage /> },
              {
                element: <InstrumentProvider children={<Outlet />} />,
                children: [
                  { path: "song", element: <SongPage /> },
                  { path: "upload", element: <UploadPage /> }
                ]
              }
            ],
        },
        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "password-reset", element: <PasswordReset />}
          ]
        },
        {
          path: "/admin",
          element: <MainLayout />,
          children: [
            { path: "dashboard", element: <AdminDashboard />},
            { path: "song-management", element: <SongManagement />},
            { path: "submission-manangement", element: <SubmissionManagement />},
            { path: "user-management", element: <UserManagement />}
          ]
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;