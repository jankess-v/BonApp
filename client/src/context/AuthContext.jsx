import {createContext, useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {authAPI} from "../services/api"
import {jwtDecode} from 'jwt-decode'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect( ()  => {
        const token = localStorage.getItem("token");
        // setIsAuthenticated(!!token);
        if(token) {
            try {
                const decoded = jwt.decode(token);
                setUser(decoded);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Błąd dekodowania tokenu", err);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials)
            if (response.success) {
                const {user, token} = response.data
                localStorage.setItem("token", token)
                // localStorage.setItem("user", JSON.stringify(user))

                const decoded = jwtDecode(token)
                setUser(decoded)
                setIsAuthenticated(true)

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
                // localStorage.setItem("user", JSON.stringify(user))

                const decoded = jwtDecode(token)
                setUser(decoded)
                setIsAuthenticated(true)

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
        // localStorage.removeItem("user")
        setIsAuthenticated(false)
        toast.success("Wylogowano pomyślnie!")
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);