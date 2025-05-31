import {useState} from "react"
import {Link, Navigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import {Eye, EyeOff, User, Lock, ChefHat, ArrowLeft} from "lucide-react"
import {useAuth} from "../context/AuthContext.jsx"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { login, isAuthenticated } = useAuth()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()

    // Przekierowanie jeśli użytkownik jest już zalogowany
    if (isAuthenticated === true) {
        return <Navigate to="/home" replace />
    }

    const onSubmit = async (data) => {
        await login(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full  space-y-8 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
                {/* Header */}
                <div className="text-center animate-fade-in">
                    <div className="flex justify-center items-center relative">
                        <Link to="/home" className="absolute left-0 top-0 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>

                        <div className="flex flex-col items-center">
                            <div className="bg-gray-900 p-3 rounded-full">
                                <Link
                                    to="/home"
                                    className="text-gray-500 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <ChefHat className="w-8 h-8 text-white hover:animate-pulse" />
                                </Link>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mt-4">Witaj ponownie</h2>
                            <p className="text-gray-600">Zaloguj się do swojego konta</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form className="space-y-10 flex-grow" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Login
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register("username", {
                                    required: "Login jest wymagany",
                                })}
                                type="text"
                                className={`block w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                    errors.username
                                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                }`}
                                placeholder="Login"
                            />
                        </div>
                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Hasło
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register("password", {
                                    required: "Hasło jest wymagane",
                                })}
                                type={showPassword ? "text" : "password"}
                                className={`block w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                    errors.password
                                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                }`}
                                placeholder="Wprowadź hasło"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer">
                        Zaloguj się
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Nie masz konta?{" "}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            Zarejestruj się
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login