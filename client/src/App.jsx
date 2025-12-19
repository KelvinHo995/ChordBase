// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, createRoutesFromElements, RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import UploadPage from "./pages/UploadPage";
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
import { InstrumentProvider } from "./context/InstrumentContext";
import { AuthProvider } from "./context/AuthContext";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      // Top-level AuthProvider wraps the entire application
      <Route element={<AuthProvider><Outlet /></AuthProvider>}>
        
        {/* === Main App Section (Uses MainLayout) === */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<UserProfile />} />

          {/* Instrument Context Group */}
          <Route element={<InstrumentProvider><Outlet /></InstrumentProvider>}>
            <Route path="song" element={<SongPage />} />
            <Route path="upload" element={<UploadPage />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="playlists" element={<Playlists />} />
            <Route path="chord-generator" element={<ChordGenerator />} />
          </Route>
        </Route>

        {/* === Authentication Section === */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="password-reset" element={<PasswordReset />} />
        </Route>

        {/* === Admin Section (Reuses MainLayout + Admin Guard) === */}
        <Route path="/admin" element={<MainLayout />}>
          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="song-management" element={<SongManagement />} />
            <Route path="user-management" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App;