import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/BackendService";
import { th } from "zod/v4/locales";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    // useEffect(() => {
    //     const token = localStorage.getItem('token');

    //     if (token) {
    //         setIsLoggedIn(true);
    //         // Fetch user details on load
    //         AuthService.getMe()
    //             .then(response => {
    //                 if (response.success) {
    //                     setUser(response.data);
    //                     setIsAdmin(response.data.role === 'admin');
    //                 }
    //             })
    //             .catch(() => {
    //                 // If token is invalid, logout
    //                 logout();
    //             });
    //     }
    // }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            //REAL LOGIN CODE (COMMENTED OUT)
            const user = await AuthService.loginUser({ email, password });
            setUser(user);
            setIsLoggedIn(true);
            setIsAdmin(user.role === 'admin');
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
            // --- MOCK REGISTER FOR TESTING ---
            // await new Promise(resolve => setTimeout(resolve, 500));
            // return { success: true };
            // ---------------------------------

            // REAL REGISTER CODE (COMMENTED OUT)
            const response = await AuthService.registerUser(userData);
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