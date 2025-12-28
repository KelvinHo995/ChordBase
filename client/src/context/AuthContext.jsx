import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/BackendService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext()

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    // JWT exp claim is typically in seconds since the epoch
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    // Handle decode errors (e.g., malformed token)
    return true;
  }
};

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const savedUser = JSON.parse(localStorage.getItem('user'));

            if (token && savedUser) {
                if (isTokenExpired(token)) {
                    setUser(null);
                    setIsAdmin(false);
                    setIsLoggedIn(false);
                } 
                else {
                    setUser(savedUser);
                    setIsLoggedIn(true);
                    setIsAdmin(savedUser.role === 'admin');
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
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

    const googleLogin = async (accessToken) => {
        setIsLoading(true);
        try {
            const user = await AuthService.loginWithGoogle(accessToken);
            setUser(user);
            setIsLoggedIn(true);
            setIsAdmin(user.role === 'admin');
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, isAdmin, isLoading, login, register, logout, googleLogin }}>
            {children}
        </AuthContext.Provider>
    )
}