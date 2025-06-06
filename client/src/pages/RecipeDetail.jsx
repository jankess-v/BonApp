import {useState, useEffect} from "react"
import {useParams, useNavigate, Link} from "react-router-dom"
import {Edit, Trash2, Clock, Users, Utensils, Flame, ArrowLeft} from "lucide-react"
import {recipeAPI} from "../services/recipeAPI"

import Navbar from "../components/Navbar.jsx";
import {useAuth} from "../context/AuthContext.jsx";

const RecipeDetail = () => {
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const {id} = useParams()
    const navigate = useNavigate()

    const {user: authUser} = useAuth()

    // console.log(authUser._id)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await recipeAPI.getRecipe(id)
                setRecipe(response.data.recipe)
                // console.log(response.data.recipe)
            } catch (error) {
                console.error("Error fetching recipe:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecipe()
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Ładowanie przepisu...</p>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500 text-lg font-bold">Nie znaleziono przepisu</p>
            </div>
        );
    }
    let isAuthor = false;
    // const user = localStorage.getItem("user");
    // if (user) {
    //     const parsedUser = JSON.parse(user);
    //     isAuthor = parsedUser._id === recipe.authorId._id;
    // }

    if(authUser?._id === recipe.authorId._id) {
        isAuthor = true
    }

    const handleDelete = async () => {
        if (window.confirm("Czy na pewno chcesz usunąć ten przepis?")) {
            try {
                await recipeAPI.deleteRecipe(recipe._id);
                navigate("/");
            } catch (error) {
                console.error("Błąd podczas usuwania przepisu", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-8">
            <Navbar/>
            <div
                className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200 mt-16 pt-12 pb-8 px-6 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <Link to="/recipes" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            <ArrowLeft className="h-6 w-6"/>
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">{recipe.title}</h1>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate(`/recipe/edit/${recipe._id}`)}
                            className={`p-2 ${isAuthor ? "text-blue-600 hover:text-blue-700" : "invisible"} transition-colors cursor-pointer`}
                        >
                            <Edit size={20}/>
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`p-2 ${isAuthor ? "text-red-600 hover:text-red-700" : "invisible"} transition-colors cursor-pointer`}
                        >
                            <Trash2 size={20}/>
                        </button>
                    </div>
                </div>

                {/* Image and Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Image */}
                    <div className="md:col-span-1">
                        {recipe.image?.url ? (
                            <img
                                src={recipe.image.url}
                                alt={recipe.title}
                                className="w-full h-80 object-cover rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Brak zdjęcia</p>
                            </div>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="md:col-span-2">
                        <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center text-gray-600">
                                <Clock size={16} className="mr-2"/>
                                <span>{recipe.cookingTime || "N/A"} minut</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Flame size={16} className="mr-2"/>
                                <span>{recipe.difficultyLevel}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Utensils size={16} className="mr-2"/>
                                <span>{recipe.category}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Users size={16} className="mr-2"/>
                                <span>Publiczny: {recipe.isPublic ? "Tak" : "Nie"}</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Składniki</h2>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        {ingredient.quantity} {ingredient.unit} – {ingredient.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Kroki wykonania</h2>
                            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                                {recipe.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        className="flex-col justify-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                        aria-label="Udostępnij przepis"
                    >
                        <div className="flex items-center space-x-2">
                            <Users size={16} className="mr-1"/> Autor: {recipe.authorId.username}
                        </div>
                        <p className="text-sm text-gray-500">Dodano: {new Date(recipe.createdAt).toLocaleDateString()}</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail
