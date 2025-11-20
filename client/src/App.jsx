// App.jsx
import React from "react";
import guitarDb from "@tombatossals/chords-db/lib/guitar.json";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SongPage from "./pages/SongPage";
import SearchPage from "./pages/SearchPage";
import MainLayout from "./layouts/MainLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "song", element: <SongPage />},
        { path: "search", element: <SearchPage />},
      ]
    }, 
    // {
    //   path: "/auth",
    //   element: <AuthLayout />,
    //   children: [
    //     { path: "login", element: <Login />},
    //     { path: "register", element: <Register />},
    //   ]
    // },
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;