import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {ChefHat, Eye, EyeOff} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import RecipeCard from "../components/recipe/RecipeCard.jsx";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";

const Profile = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const newPassword = watch("newPassword")

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }

        const fetchUserRecipes = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/recipes/myRecipes", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Błąd podczas pobierania Twoich przepisów.");
                }

                const data = await response.json();

                if (data.success && Array.isArray(data.data.recipes)) {
                    setRecipes(data.data.recipes);
                }
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if(response.ok) {
                    const data = await response.json();
                    setUsers(data.data);
                }
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoadingUsers(false);
            }
        }

        if(user.role === 'admin') {
            fetchAllUsers();
        }

        fetchUserRecipes();
    }, [navigate, isAuthenticated]);

    const handlePasswordChange = async (data) => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/change-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            })

            const result = await response.json();

            if(result.success) {
                toast.success("Hasło zmienione pomyślnie");
                reset()
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error.message);
            toast.error("Błąd przy próbie zmiany hasła")
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            const result = await response.json();

            if(result.success) {
                toast.success("Użytkownik został usunięty")
                setUsers(users.filter(u => u._id !== id))
            }
        } catch (error) {
            console.error(error.message);
            toast.error("Błąd przy usuwaniu użytkownika")
        }
    }

    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe._id}`)
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Ładowanie danych profilu...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mb-8">
            <Navbar/>
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200 mt-8">
                {/* Header */}
                <div className="text-center animate-fade-in mb-8">
                    <div className="flex justify-center mb-4">
                        <Link to="/home">
                            <div className="bg-gray-900 p-3 rounded-full">
                                <ChefHat className="w-8 h-8 text-white hover:animate-pulse"/>
                            </div>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                    <p className="text-gray-600">Zobacz swoje dane i przepisy</p>
                </div>

                {/* Dane użytkownika */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
                        <div>
                            <p className="text-sm text-gray-500">Imię</p>
                            <p className="font-medium text-gray-900">{user.firstName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nazwisko</p>
                            <p className="font-medium text-gray-900">{user.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Użytkownik od</p>
                            <p className="font-medium text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formularz zmiany hasła */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Zmień hasło</h2>
                    <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Obecne hasło *
                            </label>
                            <div className="relative">
                                <input
                                    {...register("currentPassword", {
                                        required: "Obecne hasło jest wymagane",
                                    })}
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Wprowadź obecne hasło"
                                    className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                        errors.currentPassword
                                            ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Nowe hasło *
                            </label>
                            <div className="relative">
                                <input
                                    {...register("newPassword", {
                                        required: "Nowe hasło jest wymagane",
                                        minLength: {
                                            value: 6,
                                            message: "Hasło musi mieć co najmniej 6 znaków",
                                        },
                                    })}
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Wprowadź nowe hasło"
                                    className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                        errors.newPassword
                                            ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Powtórz nowe hasło *
                            </label>
                            <input
                                {...register("confirmPassword", {
                                    required: "Potwierdzenie hasła jest wymagane",
                                    validate: (value) =>
                                        value === newPassword || "Hasła nie są identyczne",
                                })}
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Powtórz nowe hasło"
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none placeholder:text-gray-500 text-black ${
                                    errors.confirmPassword
                                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                                        : "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Zmień hasło
                        </button>
                    </form>
                </div>

                {/* Lista przepisów */}
                {user.role !== 'admin' ? (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Twoje przepisy</h2>
                    {recipes.length === 0 ? (
                        <p className="text-gray-500">Nie masz jeszcze żadnych przepisów.</p>
                    ) : (
                        (
                            <>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                    {recipes.map((recipe) => (
                                        <RecipeCard key={recipe._id} recipe={recipe} onClick={handleRecipeClick}/>
                                    ))}
                                </div>
                            </>
                        ))}
                </div>
                ) : (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lista użytkowników</h2>
                        {loadingUsers ? (
                            <p className="text-gray-500">Ładowanie użytkowników...</p>
                        ) : users.length === 0 ? (
                            <p className="text-gray-500">Brak zarejestrowanych użytkowników.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm text-left text-gray-600">
                                    <thead className="bg-gray-100 text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-4 py-2">Imię</th>
                                        <th className="px-4 py-2">Nazwisko</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Utworzony</th>
                                        <th className="px-4 py-2">Rola</th>
                                        <th className="px-4 py-2">Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} className="border-t">
                                            <td className="px-4 py-2">{u.firstName}</td>
                                            <td className="px-4 py-2">{u.lastName}</td>
                                            <td className="px-4 py-2">{u.email}</td>
                                            <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{u.role}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="text-red-600 hover:underline text-sm hover:cursor-pointer"
                                                >
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default Profile;