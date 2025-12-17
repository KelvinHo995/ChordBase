// App.jsx
import React from "react";
import guitarDb from "@tombatossals/chords-db/lib/guitar.json";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import UploadPage from "./pages/UploadPage";
import { InstrumentProvider } from "./context/InstrumentContext";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SongManagement from "./pages/admin/SongManagement";
import UserManagement from "./pages/admin/UserManagement";
import PasswordReset from "./pages/PasswordReset";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ProtectedRoute, AdminRoute } from "./components/PrivateRoutes";
import Playlists from "./pages/Playlists";
import UserProfile from "./pages/UserProfile";
import ChordGenerator from "./pages/ChordGenerator";

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
              { path: "profile", element: <UserProfile />},
              {
                element: <InstrumentProvider children={<Outlet />} />,
                children: [
                  { path: "song", element: <SongPage /> },
                  { path: "upload", element: <UploadPage /> }
                ]
              },
              {
                element: <ProtectedRoute />,
                children: [
                  { path: "playlists", element: <Playlists />},
                  { path: "chord-generator", element: <ChordGenerator />}
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
          children: [{
            element: <AdminRoute />,
            children: [
              { path: "dashboard", element: <AdminDashboard />},
              { path: "song-management", element: <SongManagement />},
              { path: "user-management", element: <UserManagement />}
            ]
          }]
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;