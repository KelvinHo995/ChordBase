import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(true)

    const login = () => {
        localStorage.setItem('auth_token', 'fake_token') // :))))))))))))))
        setIsLoggedIn(true)
        setIsAdmin(false) // based on role
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
        setIsLoggedIn(false)
        setIsAdmin(false)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}