import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/BackendService";
import { th } from "zod/v4/locales";
import { se } from "date-fns/locale";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = JSON.parse(localStorage.getItem('user'));

        if (token && savedUser) {
            setUser(savedUser);
            setIsLoggedIn(true);
            setIsAdmin(savedUser.role === 'admin');
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            //REAL LOGIN CODE (COMMENTED OUT)
            const user = await AuthService.loginUser({ email, password });
            setUser(user);
            setIsLoggedIn(true);
            setIsAdmin(user.role === 'admin');
            localStorage.setItem('user', JSON.stringify(user))
            return { success: true };
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const register = async (userData) => {
        setIsLoading(true);
        try {
            const user = await AuthService.registerUser(userData);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setIsLoggedIn(false)
        setIsAdmin(false)
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}