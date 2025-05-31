import {createContext, useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {authAPI} from "../services/api"

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        setIsAuthenticated(!!token);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials)
            if (response.success) {
                const {user, token} = response.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setIsAuthenticated(true);

                toast.success("Zalogowano pomyślnie!")
                return {success: true}
            }
        } catch (error) {
            const message = error.response?.data?.message || "Błąd podczas logowania"
            toast.error(message)
            return {success: false, error: message}
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData)
            if (response.success) {
                const {user, token} = response.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setIsAuthenticated(true);

                toast.success("Zarejestrowano pomyślnie!")
                return {success: true}
            }
        } catch (error) {
            const message = error.response?.data?.message || "Błąd podczas rejestracji"
            toast.error(message)
            return {success: false, error: message}
        }
    }

    const logout = async () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setIsAuthenticated(false)
        toast.success("Wylogowano pomyślnie!")
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);