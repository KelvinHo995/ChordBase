import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn)
        return <Navigate to='/auth/login' />
    
    return <Outlet />
}

export const AdminRoute = () => {
    const { isLoggedIn, isAdmin } = useAuth()

    if (!isLoggedIn)
        return <Navigate to='/auth/login' />

    if (!isAdmin) 
        return <Navigate to='/' />

    return <Outlet />
}