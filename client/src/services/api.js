import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        ContentType: 'application/json',
        // Authorization: `Bearer ${localStorage.getItem("token")}`
    },
})

// Interceptor dla dodawania tokenu do requestów
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// // Interceptor dla obsługi odpowiedzi
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem("token")
//             localStorage.removeItem("user")
//             window.location.href = "/login"
//         }
//         return Promise.reject(error)
//     },
// )

//Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData)
        return response.data
    },
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials)
        return response.data
    },
    verifyToken: async (token) => {
        const response = await api.post('/auth/verifyToken', token)
        return response.data
    }
}

export default api;